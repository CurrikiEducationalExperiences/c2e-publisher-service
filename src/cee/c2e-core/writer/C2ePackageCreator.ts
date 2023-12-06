// creat class "C2ePackageCreator" to which create directory with c2e identifier and create c2e.json file

import fs, {ReadStream} from 'node:fs';
import path from 'path';
import C2eContentDocumentCollectionLd from '../classes/C2eContentDocumentCollectionLd';
import C2eContentDocumentLd from '../classes/C2eContentDocumentLd';
import C2eContentLd from '../classes/C2eContentLd';
import C2eLd from '../classes/C2eLd';
import C2eDigitalDocument from '../interfaces/C2eDigitalDocument';
import {c2eSourceHtmlTemplate, c2eSourceJsTemplate} from "./C2eSourceCodeTemplate";

class C2ePackageCreator {
    private c2dId: string;
    private c2eDirectory: string;
    private c2eJsonLdFile: string;
    private c2eJsonLd: any;
    private c2eJsonLdString: string;
    private c2eJsonLdPath: string;
    private c2eJsonLdFileCreated: boolean;
    private c2eDirectoryCreated: boolean;
    private c2ePath: string;
    constructor(c2dId: string, c2ePath: string = '') {
        this.c2dId = c2dId;
        this.c2ePath = c2ePath;
        if (c2ePath === '') {
            this.c2eDirectory = path.join(__dirname, '..', '..', 'c2eid-' + c2dId);
        } else {
            this.c2eDirectory = path.join(c2ePath, 'c2eid-' + c2dId);
        }

        this.c2eJsonLdFile = path.join(this.c2eDirectory, 'c2e.json');
        this.c2eJsonLd = {};
        this.c2eJsonLdString = '';
        this.c2eJsonLdPath = '';
        this.c2eJsonLdFileCreated = false;
        this.c2eDirectoryCreated = false;
        this.createC2eDirectory();
    }

    public createC2eDirectory(): boolean {
        if (!fs.existsSync(this.c2eDirectory)) {
            fs.mkdirSync(this.c2eDirectory);
            fs.mkdirSync(this.c2eDirectory + '/resources');
            fs.mkdirSync(this.c2eDirectory + '/content');
            fs.mkdirSync(this.c2eDirectory + '/source');
            this.c2eDirectoryCreated = true;
            return true;
        } else {
            fs.rmSync(this.c2eDirectory, {recursive: true});
            this.c2eDirectoryCreated = false;
            this.createC2eDirectory();
            return false;
        }
    }

    public createC2ePackage(c2eJsonLd: any, resourcesToCopy: Array<{sourceFilePath: string, c2eResource: C2eDigitalDocument}>, c2eContents: C2eContentDocumentCollectionLd, c2eContentsToCreate: Array<{c2eContent: Record<string, any>, c2eContentDocument: C2eContentDocumentLd | undefined}> = [], c2eLd: C2eLd): ReadStream | boolean {
        if (this.c2eDirectoryCreated) {
            this.c2eJsonLd = c2eJsonLd;
            this.c2eJsonLdString = JSON.stringify(this.c2eJsonLd, null, 4);
            const c2eContentsLdString = JSON.stringify(c2eContents.toJsonLd(), null, 4);
            fs.writeFileSync(this.c2eJsonLdFile, this.c2eJsonLdString);
            this.processC2eResourcesToCreate(resourcesToCopy);
            this.processC2eContentsToCreate(c2eContentsToCreate);
            fs.writeFileSync(path.join(this.c2eDirectory, '/content/contents.json'), c2eContentsLdString);
            fs.writeFileSync(path.join(this.c2eDirectory, '/source/index.html'), c2eSourceHtmlTemplate(c2eLd));
            fs.writeFileSync(path.join(this.c2eDirectory, '/source/index.js'), c2eSourceJsTemplate(c2eLd));
            this.c2eJsonLdFileCreated = true;
            let readStream = this.createC2ePackageZip();
            return readStream;
        } else {
            this.c2eJsonLdFileCreated = false;
            return false;
        }
    }

    processC2eResourcesToCreate(resourcesToCopy: Array<{sourceFilePath: string, c2eResource: C2eDigitalDocument}>) {
        resourcesToCopy.forEach((resourceToCopy) => {
            const sourceFilePath = resourceToCopy.sourceFilePath;
            const c2eResource = resourceToCopy.c2eResource;
            const c2eResourcePath = path.join(this.c2eDirectory, c2eResource.getUrl());
            fs.copyFileSync(sourceFilePath, c2eResourcePath);
        });
    }

    processC2eContentsToCreate(c2eContentsToCreate: Array<{c2eContent: Record<string, any>, c2eContentDocument: C2eContentDocumentLd | undefined}> = []) {
        c2eContentsToCreate.forEach((c2eContentToCreate) => {
            const c2eContent = c2eContentToCreate.c2eContent;
            const c2eContentDocument = c2eContentToCreate.c2eContentDocument;
            if (c2eContentDocument) {
                const c2eContentLd = new C2eContentLd(c2eContent, c2eContentDocument);
                fs.writeFileSync(path.join(this.c2eDirectory, c2eContentDocument.getUrl()), JSON.stringify(c2eContentLd.toJsonLd(), null, 4));
            }
        });
    }

    // create adm-zip package and name it with c2e identifier with .c2e extension
    createC2ePackageZip(): ReadStream | boolean {
        if (this.c2eJsonLdFileCreated) {

            // C2E package based on early protection prototype.
            const c2eDirectoryNested = path.join(this.c2eDirectory, 'c2eid-' + this.c2dId);

            // create directory for c2eDirectoryNested. Copy resources, content and source directories recursively to c2eDirectoryNested.
            fs.mkdirSync(c2eDirectoryNested);
            fs.mkdirSync(c2eDirectoryNested + '/resources');
            fs.mkdirSync(c2eDirectoryNested + '/content');
            fs.mkdirSync(c2eDirectoryNested + '/source');

            fs.cpSync(this.c2eDirectory + '/resources', c2eDirectoryNested + '/resources', {recursive: true});
            fs.cpSync(this.c2eDirectory + '/content', c2eDirectoryNested + '/content', {recursive: true});
            fs.cpSync(this.c2eDirectory + '/source', c2eDirectoryNested + '/source', {recursive: true});
            fs.cpSync(this.c2eJsonLdFile, path.join(c2eDirectoryNested, 'c2e.json'));

            fs.rmSync(this.c2eDirectory + '/resources', {recursive: true, force: true});
            fs.rmSync(this.c2eDirectory + '/content', {recursive: true, force: true});
            fs.rmSync(this.c2eDirectory + '/source', {recursive: true, force: true});
            fs.renameSync(path.join(this.c2eDirectory, 'c2e.json'), path.join(this.c2eDirectory, 'manifest.json'));

            const c2eDirectoryNestedTmp = path.join(this.c2eDirectory + '-tmp/');
            fs.mkdirSync(c2eDirectoryNestedTmp);
            const c2eDirectoryNestedTmp2 = path.join(c2eDirectoryNestedTmp, 'c2eid-' + this.c2dId);
            fs.mkdirSync(c2eDirectoryNestedTmp2);
            fs.cpSync(this.c2eDirectory, c2eDirectoryNestedTmp2, {recursive: true});
            fs.rmSync(this.c2eDirectory, {recursive: true, force: true});
            fs.renameSync(c2eDirectoryNestedTmp, this.c2eDirectory);
            // zip the c2eDirectoryNested directory
            const AdmZip = require('adm-zip');
            const zip = new AdmZip();
            zip.addLocalFolder(c2eDirectoryNested, 'c2eid-' + this.c2dId);
            zip.writeZip(path.join(this.c2ePath, 'c2eid-' + this.c2dId + '.zip'));
            fs.rmSync(c2eDirectoryNested, {recursive: true, force: true});

            const zipC2ePath = path.join(this.c2ePath, 'c2eid-' + this.c2dId + '.zip');
            var packageFile = fs.createReadStream(zipC2ePath);
            return packageFile;
        } else {
            return false;
        }
    }
}

export default C2ePackageCreator;
