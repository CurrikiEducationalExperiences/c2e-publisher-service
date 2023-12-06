import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import {MySequence} from './sequence';

export {ApplicationConfig};

import {generateUniqueId} from "@loopback/context";
import {FILE_UPLOAD_SERVICE, OPENAI_KEY, STORAGE_DIR, TEMP_DIR} from './keys';

export class C2EPublisherServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    dotenv.config();

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;

    // Configure file upload with multer options
    this.configureFileUpload(options.fileStorageDirectory);

    this.bind(OPENAI_KEY).to((process.env.OPENAI_KEY || ''));
    this.bind(TEMP_DIR).to((process.env.TEMP_DIR || ''));

    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  /**
   * Configure `multer` options for file upload
   */
  protected configureFileUpload(destination?: string) {
    // Upload files to `dist/.sandbox` by default
    const storagePath = process.env.STORAGE_DIR ? path.resolve(process.env.STORAGE_DIR) : path.join('./c2e-storage');
    destination = destination ?? storagePath;
    this.bind(STORAGE_DIR).to(destination);
    const multerOptions: multer.Options = {
      storage: multer.diskStorage({
        destination,
        // Use the original file name as is
        filename: (req, file, cb) => {
          file.originalname = generateUniqueId() + '-' + file.originalname;
          cb(null, file.originalname);
        },
      }),
    };
    // Configure the file upload service with multer options
    this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);
  }
}
