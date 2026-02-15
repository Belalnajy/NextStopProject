import { Router } from 'express';
import {
  getSettings,
  updateSettings,
  uploadHeroImage,
} from '../controllers/settingsController';
import { authenticate } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

// Public: Get Settings (for frontend to render dynamic content)
router.get('/', getSettings as any);

// Admin: Update Settings
router.put('/', authenticate, upload.single('logo'), updateSettings as any);
router.patch('/', authenticate, upload.single('logo'), updateSettings as any);

// Admin: Upload Hero Image
// We use a separate route for this to handle multiple file uploads more easily via the array UI
router.post(
  '/upload-hero',
  authenticate,
  upload.single('image'),
  uploadHeroImage as any,
);

export default router;
