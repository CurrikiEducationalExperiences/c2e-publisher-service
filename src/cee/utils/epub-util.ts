import AdmZip from 'adm-zip';
import * as fs from 'fs';
import OpenAI from 'openai';
import path from 'path';
import {OPENAI_KEY, STORAGE_DIR, TEMP_DIR} from '../../config';
import {CeeMedia} from '../../models';
import {CeeMediaRepository} from '../../repositories';
const cheerio = require('cheerio');

interface FileType {
  filename: string,
  path: string
}


interface NavPoint {
  label: string;
  src?: string;
  children?: NavPoint[];
}

const walk = (dir: string, files: Array<FileType> = []): Array<FileType> => {
  const dirFiles = fs.readdirSync(dir)
  for (const f of dirFiles) {
    const stat = fs.lstatSync(dir + '/' + f)
    if (stat.isDirectory()) {
      walk(dir + '/' + f, files)
    } else {
      files.push({filename: f, path: dir + '/' + f})
    }
  }
  return files
}

export const epubSplitter = async (epub: string, ceeMediaRepository: CeeMediaRepository, parentCeeMedia: CeeMedia, isbn: string): Promise<boolean> => {
  const tempId = "id" + Math.random().toString(16).slice(2);
  const file = epub;
  // Unzip to temp folder
  const zip = new AdmZip(file);
  const tempBookPath = path.join(TEMP_DIR, `/${tempId}/tempbook`);
  zip.extractAllTo(tempBookPath, true);
  // Read through the spine in content.opf
  const tocFolder = getTocDirectory(tempBookPath);
  const contentFileData = fs.readFileSync(`${tempBookPath}/${tocFolder}/content.opf`, 'utf-8');
  const tocFileData = fs.readFileSync(`${tempBookPath}/${tocFolder}/toc.ncx`, 'utf-8');
  const $content = cheerio.load(contentFileData, {xml: true});
  const $toc = cheerio.load(tocFileData, {xml: true});
  const idrefArray = $content('itemref').get().map((item: any) => {return item.attribs.idref;});

  const chaptersArray = []; // Holds a map of chapter title to ceemedia.id

  for (const idref of idrefArray) {
    // Create new copy
    zip.extractAllTo(path.join(TEMP_DIR, `/${tempId}/${idref}`), true);

    // Editing content.opf (content manifest)
    const $innerContent = cheerio.load(contentFileData, {xml: true});
    const xhtmlFile = $innerContent(`#${idref}`)[0].attribs.href;
    // trace xhtmlFile as "navMap navPoint content src" in toc.ncx
    const navpointContentTag = $toc(`navMap navPoint content[src*="${xhtmlFile}"]`);
    if (navpointContentTag.length === 0) {
      console.log(`Unexpected navpoint format or content item not in table of contents`, `idref ${idref}`, `xhtmlFile: ${xhtmlFile}`);
      continue;
      // throw new Error(`Unexpected navpoint format for ${idref} chapter content. xhtmlFile: ${xhtmlFile}`);
    }
    // Get parent navpoint. Will be used as collection if it exists
    let hierarchyParentLabel = '';
    let hierarchyParentId = '';
    const sectionTitle = $toc(`navPoint[id="${navpointContentTag[0].parent.attribs.id}"] > navLabel > text`)[0].children[0].data;
    if (navpointContentTag[0].parent.parent.name === 'navPoint') {
      const parentLabel = $toc(`navPoint[id="${navpointContentTag[0].parent.parent.attribs.id}"] > navLabel > text`)[0].children[0].data;
      hierarchyParentLabel = (parentLabel) ? parentLabel : `${parentCeeMedia.title}*`;
      for (const chap of chaptersArray) {
        if (chap.title === hierarchyParentLabel) {
          hierarchyParentId = chap.id;
          break;
        }
      }
    } else {
      hierarchyParentLabel = parentCeeMedia.title;
      hierarchyParentId = parentCeeMedia.id;
    }

    // get parent navMap of navpointContentTag
    const xhtmlFileNavMapTag = navpointContentTag.parent();
    const allNavPoints: NavPoint[] = getAllNavPoints($toc, xhtmlFileNavMapTag);
    const navPointChildXhtmlFiles: Array<string> = [];
    allNavPoints.filter((navPoint) => navPoint.src?.indexOf('#') === -1).forEach((navPoint) => navPointChildXhtmlFiles.push((navPoint.src ? navPoint.src : '')));
    // map navPointChildXhtmlFiles to content.opf manifest item href
    const idrefChildren: Array<string> = navPointChildXhtmlFiles.map((xhtmlFile) => $innerContent(`item[media-type="application/xhtml+xml"][href*="${xhtmlFile}"]`)[0]?.attribs?.id);
    const idrefAll: Array<string> = [idref, ...idrefChildren];
    const xhtmlFileAll: Array<string> = [xhtmlFile, ...navPointChildXhtmlFiles];

    // remove $innerContent itemref[idref] other than idrefAll
    $innerContent('itemref').each((i: any, item: any) => {
      const idref = item?.attribs?.idref;
      if (idref && idrefAll.indexOf(idref) === -1) {
        $innerContent(item).remove();
      }
    });

    // remove $innerContent item[id] other than idrefAll with media-type="application/xhtml+xml"
    $innerContent('item[media-type="application/xhtml+xml"]').each((i: any, item: any) => {
      const id = item?.attribs?.id;
      if (id && idrefAll.indexOf(id) === -1) {
        $innerContent(item).remove();
      }
    });

    fs.writeFileSync(path.join(TEMP_DIR, `/${tempId}/${idref}/${tocFolder}/content.opf`), $innerContent.html());

    // Editing toc.ncx (table of contents)
    const $innerToc = cheerio.load(tocFileData, {xml: true});
    const navpointContent = $innerToc(`content[src*="${xhtmlFile}"]`);
    if (navpointContent.length === 0) {
      throw new Error(`Unexpected navpoint format for ${idref} chapter.`);
    }
    const html = $innerToc.html(navpointContent[0].parent); // Getting chapter navpoint
    $innerToc('navPoint').remove(); // Removing all navpoints
    $innerToc(html).appendTo('navMap');
    fs.writeFileSync(path.join(TEMP_DIR, `/${tempId}/${idref}/${tocFolder}/toc.ncx`), $innerToc.html());

    // Delete unused xhtml files and images
    const allFiles: Array<FileType> = Object.assign(new Array<FileType>(), walk(path.join(TEMP_DIR, `/${tempId}/${idref}/${tocFolder}`)));
    // const chapterXhtml = fs.readFileSync(path.join(publicPath, `temp/${idref}/OPS/${xhtmlFile}`), 'utf-8');
    const chaptersXhtml = xhtmlFileAll.map(xhtmlFile => fs.readFileSync(path.join(TEMP_DIR, `/${tempId}/${idref}/${tocFolder}/${xhtmlFile}`), 'utf-8')).join(' ');
    const removedFiles: Array<FileType> = [];

    for (const contentFile of allFiles) {
      if (contentFile.filename.indexOf('.xhtml') !== -1 && xhtmlFileAll.findIndex((e) => contentFile.path.indexOf(e) !== -1) === -1) {
        fs.unlinkSync(contentFile.path);
        removedFiles.push(contentFile);
      }

      // make isMedia const for if statement by checking file.filename.indexOf for following file extensions: .jpg .jpeg .png .gif .svg  .mp3 .ogg .mp4 .webm
      const isMedia = contentFile.filename.indexOf('.jpg') !== -1 || contentFile.filename.indexOf('.jpeg') !== -1 || contentFile.filename.indexOf('.png') !== -1 || contentFile.filename.indexOf('.gif') !== -1 || contentFile.filename.indexOf('.svg') !== -1 || contentFile.filename.indexOf('.mp3') !== -1 || contentFile.filename.indexOf('.ogg') !== -1 || contentFile.filename.indexOf('.mp4') !== -1 || contentFile.filename.indexOf('.webm') !== -1;
      if (isMedia && contentFile.filename.indexOf('cover') === -1 && chaptersXhtml.indexOf(contentFile.filename) === -1) {
        fs.unlinkSync(contentFile.path);
        removedFiles.push(contentFile);
      }
    }

    // Repackaging
    const zip2 = new AdmZip();
    zip2.addLocalFile(path.join(TEMP_DIR, `/${tempId}/${idref}/mimetype`));
    zip2.addLocalFolder(path.join(TEMP_DIR, `/${tempId}/${idref}/META-INF`), 'META-INF');
    zip2.addLocalFolder(path.join(TEMP_DIR, `/${tempId}/${idref}/${tocFolder}`), tocFolder);

    // read OPS/content.opf file and get html
    const contentOpf = zip2.getEntries().find((e: any) => e.entryName === `${tocFolder}/content.opf`);
    // remove <item> tags cotained in <manifest> from contentOpf with respect to href attribute
    const contentOpfHtml = contentOpf?.getData().toString('utf8');
    const $contentOpf = cheerio.load(contentOpfHtml, {xml: true});

    $contentOpf('manifest item').each((i: any, item: any) => {
      const href = item?.attribs?.href;
      if (href && removedFiles.find((f) => href.indexOf(f.filename) !== -1)) {
        $contentOpf(item).remove();
      }
    });

    // update contentOpf with new html
    zip2.updateFile(`${tocFolder}/content.opf`, Buffer.from($contentOpf.html(), 'utf8'));

    const ceeMediaRecord = await ceeMediaRepository.create({
      title: sectionTitle,
      description: sectionTitle,
      type: 'epub',
      resource: 'pending',
      parentId: hierarchyParentId,
      identifierType: 'ISBN',
      identifier: isbn,
      collection: hierarchyParentLabel
    });
    const epubFile = idref + '-' + ceeMediaRecord.id + '.epub';
    zip2.writeZip(path.join(STORAGE_DIR, `/${epubFile}`));
    // copy cover fie
    const thumbnailPath = getThumbnailPath(path.join(TEMP_DIR, `/${tempId}/${idref}/${tocFolder}`));
    const thumbnailFile = idref + '-' + ceeMediaRecord.id + '_thumbnail.' + thumbnailPath.split('.')[1];
    fs.copyFileSync(thumbnailPath, path.join(STORAGE_DIR, `/${thumbnailFile}`));
    await ceeMediaRepository.updateById(ceeMediaRecord.id, {
      resource: epubFile,
      thumbnail: thumbnailFile
    });
    chaptersArray.push({id: ceeMediaRecord.id, title: sectionTitle});
  };

  // Cleanup
  fs.rmSync(path.join(TEMP_DIR, `/${tempId}`), {recursive: true, maxRetries: 10});
  return true;
};


function getAllNavPoints($: cheerioLib.CheerioAPI, element: any): NavPoint[] {
  const navPoints: NavPoint[] = [];

  $(element).find('navPoint').each(function () {
    const navPoint = $(this);
    const navLabel = navPoint.find('navLabel text:eq(0)').text();
    const contentSrc = navPoint.find('content:eq(0)').attr('src');

    const currentNavPoint: NavPoint = {
      label: navLabel,
    };

    if (contentSrc) {
      currentNavPoint.src = contentSrc;
    }

    getAllNavPoints($, navPoint);
    navPoints.push(currentNavPoint);
  });

  return navPoints;
}

export const createEpubCeeMedia = async (epubPath: string, ceeMediaRepository: CeeMediaRepository, resource: string, isbn: string, collection: string): Promise<CeeMedia> => {
  const admZip = new AdmZip(epubPath);
  const epubEntries = admZip.getEntries(); // an array of ZipEntry records
  // read content.opf file and get html

  const contentOpf = epubEntries.find((e) => e.entryName.toLowerCase() === 'ops/content.opf' || e.entryName.toLowerCase() === 'oebps/content.opf');

  if (!contentOpf) {
    throw new Error('createEpubCeeMedia: Unsupported epub format');
  }

  const contentOpfHtml = contentOpf.getData().toString('utf8');
  // load html from contentOpfHtml using cheerio
  const contentOpfHtmlParsed = cheerio.load(contentOpfHtml, {xml: true});
  // get text from dc:title tag from contentOpfHtmlParsed
  const title = contentOpfHtmlParsed('dc\\:title').text();
  const media = await ceeMediaRepository.create({
    title,
    description: title,
    type: 'epub',
    resource,
    identifierType: 'ISBN',
    identifier: isbn,
    collection: collection
  });

  return media;
}

const getTocDirectory = (pathName: string): string => {
  const validFolders = ['ops', 'OPS', 'oebps', 'OEBPS'];
  const filenames = fs.readdirSync(pathName);

  for (const folder of validFolders) {
    if (filenames.indexOf(folder) !== -1) return folder;
  }

  throw new Error('getTocDirectory: Unsupported epub format');
};

const getThumbnailPath = (tocFolderPath: string): string => {
  const filenames = fs.readdirSync(`${tocFolderPath}/images`);

  for (const file of filenames) {
    if (file.indexOf('cover.') !== -1) return `${tocFolderPath}/images/${file}`;
  }

  throw new Error('getTocDirectory: Unsupported epub format. No cover found.');
};

export const generateEpubDescription = async (epubPath: string, model: string, maxContextChars: number): Promise<string> => {
  const validModels = ["gpt-4", "gpt-4-1106-preview"];
  if (validModels.indexOf(model) === -1) return `EINMOD Model is not valid: ${model}`;

  const tempId = "id" + Math.random().toString(16).slice(2);
  const fullEpubPath = `${STORAGE_DIR}/${epubPath}`;
  const tempBookPath = `${TEMP_DIR}/${tempId}`;

  if (!fs.existsSync(fullEpubPath)) return `ENOFILE File doesn't exist: ${fullEpubPath}`;
  // Unzip to temp folder
  const zip = new AdmZip(fullEpubPath);
  zip.extractAllTo(tempBookPath, true);
  // Get title, table of contents
  const tocDir = `${tempBookPath}/${getTocDirectory(tempBookPath)}`;
  const title = getTitle(tocDir);
  const toc = getTableOfContents(tocDir);
  // Loop through list of files and get text until we reach context limit
  //const filenames = fs.readdirSync(tocDir);
  const filenames = walk(tocDir);
  let content = '';

  for (const filename of filenames) {
    if (content.length >= maxContextChars) break;
    if (filename.path.indexOf('.xhtml') === -1) continue;

    const fileContent = getFirstPages(filename.path);
    content += fileContent.substring(0, maxContextChars - content.length);
  }

  // Generate description
  const systemPrompt = 'You are a librarian. You will receive some text from a book including the ' +
    'title, table of contents and some sample text from the contents of the book.' +
    'You will respond with with a short description of the content of the chapter.' +
    'Dont provide any commentary, just the description. ' +
    'Limit your responses to 30 words maximum, this is very important.';
  const promptText = `Title: ${title} Table of Contents: ${toc.toString()} Book Contents: ${content}`;
  const openai = new OpenAI({
    apiKey: OPENAI_KEY
  });
  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      {"role": "system", "content": systemPrompt},
      {"role": "user", "content": promptText}
    ]
  });
  // Clean up
  fs.rmSync(tempBookPath, {recursive: true, maxRetries: 10});
  return response.choices[0].message.content + '';
}

const getTitle = (filePath: string): string => {
  const fileData = fs.readFileSync(`${filePath}/content.opf`, 'utf-8');
  const $contentOpf = cheerio.load(fileData, {xml: true});
  const title = $contentOpf('dc\\:title').text();
  return title;
};

const getTableOfContents = (filePath: string): string[] => {
  const fileData = fs.readFileSync(`${filePath}/toc.ncx`, 'utf-8');
  const $ = cheerio.load(fileData, {xmlMode: true});
  const textNodes = $('text');
  const result = [];
  for (let i = 0; i < textNodes.length; i++) {
    const text = textNodes.eq(i).text();
    if (text.length > 3)  // Ignoring page listings
      result.push(textNodes.eq(i).text());
  }
  return result;
};

const getFirstPages = (filePath: string): string => {
  const fileData = fs.readFileSync(filePath, 'utf-8');
  return removeHtmlTags(fileData);
};

function removeHtmlTags(xhtmlString: string) {
  const $ = cheerio.load(xhtmlString, {xmlMode: true});
  return $('*').contents().filter((i: number, element: any) => {
    return element.nodeType === 3;
  }).text();
}
