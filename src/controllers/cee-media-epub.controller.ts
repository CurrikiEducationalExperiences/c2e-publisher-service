import {inject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  Request,
  Response,
  RestBindings,
  post,
  requestBody
} from '@loopback/rest';
import * as path from 'path';
import {FileUploadResponse} from "../cee/types";
import {FILE_UPLOAD_SERVICE, STORAGE_DIR} from '../keys';
import {CeeMediaRepository} from '../repositories';
import {EpubUtilService} from '../services';
import {FileUploadHandler} from '../types';

export class CeeMediaEpubController {
  constructor(
    @repository(CeeMediaRepository)
    public ceeMediaRepository: CeeMediaRepository,
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
    @inject(STORAGE_DIR) private storageDir: string,
    @inject('services.epub-util') private epubUtilService: EpubUtilService
  ) { }

  @post('/c2e-media/create-epubs', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'EPUB splitted and C2Es created',
      },
    },
  })
  async create(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, async (err: unknown) => {
        if (err) reject(err);
        else {
          resolve(this.getFilesAndFields(
            request,
            this.ceeMediaRepository,
            this.storageDir
          ));
        }
      });
    });
  }

  private async getFilesAndFields(
    request: Request,
    ceeMediaRepository: CeeMediaRepository,
    storageDirectory: string
  ) {
    const uploadedFiles = request.files;
    const mapper = (f: globalThis.Express.Multer.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      encoding: f.encoding,
      mimetype: f.mimetype,
      size: f.size,
    });
    let files: object[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }

    const filesList: Array<FileUploadResponse> = Object.assign(new Array<FileUploadResponse>(), files);
    const c2eMediaFile = filesList.length > 0 && filesList[0].originalname ? filesList[0].originalname : undefined;
    const c2eMediaMimetype = filesList.length > 0 && filesList[0].mimetype ? filesList[0].mimetype : undefined;
    const collection = ('collection' in request.body) ? request.body.collection : 'C2E Collection';
    if (c2eMediaFile && c2eMediaMimetype && ('isbn' in request.body)) {
      const epubPath = path.join(storageDirectory, '/', filesList[0].originalname);
      const ceeMedia = await this.epubUtilService.createEpubCeeMedia(epubPath, ceeMediaRepository, filesList[0].originalname, request.body.isbn, collection);
      await this.epubUtilService.epubSplitter(epubPath, ceeMediaRepository, ceeMedia, request.body.isbn);
    }
    return {files, fields: request.body};
  }
}
