declare module 'multer-storage-cloudinary' {
  import { StorageEngine } from 'multer';
  import { v2 as cloudinary } from 'cloudinary';

  interface Option {
    cloudinary: typeof cloudinary;
    params?: {
      folder?: string;
      allowed_formats?: string[];
      resource_type?: string;
      [key: string]: any;
    };
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: Option);
    _handleFile(req: any, file: any, cb: any): void;
    _removeFile(req: any, file: any, cb: any): void;
  }
}
