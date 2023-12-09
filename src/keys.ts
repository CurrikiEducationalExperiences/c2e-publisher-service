import {BindingKey} from '@loopback/core';
import {FileUploadHandler} from './types';

/**
 * Binding key for the file upload service
 */
export const FILE_UPLOAD_SERVICE = BindingKey.create<FileUploadHandler>(
  'services.FileUpload',
);

/**
 * Binding key for the storage directory
 */
export const STORAGE_DIR = BindingKey.create<string>('storage.directory');
export const TEMP_DIR = BindingKey.create<string>('storage.temp');
export const OPENAI_KEY = BindingKey.create<string>('key.openai');
export const AWS_CREDENTIALS_ACCESS_KEY_ID = BindingKey.create<string>('key.aws.credentials.accessKeyId');
export const AWS_CREDENTIALS_SECRET_ACCESS_KEY = BindingKey.create<string>('key.aws.credentials.secretAccessKey');
export const AWS_REGION = BindingKey.create<string>('key.aws.region');
export const AWS_S3_BUCKET = BindingKey.create<string>('key.aws.s3.bucket');
export const AWS_S3_BUCKET_URL = BindingKey.create<string>('key.aws.s3.bucketUrl');
export const MASTER_KEY = BindingKey.create<string>('key.masterkey');
