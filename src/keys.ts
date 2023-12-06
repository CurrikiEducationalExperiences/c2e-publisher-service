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
