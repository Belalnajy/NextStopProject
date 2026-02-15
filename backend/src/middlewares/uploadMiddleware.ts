import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'nextstop_uploads',
    allowed_formats: ['jpg', 'png', 'pdf'],
    resource_type: 'auto',
  } as any,
});

export const upload = multer({ storage: storage });
