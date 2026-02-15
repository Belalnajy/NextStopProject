import { Router } from 'express';
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  downloadAttachment,
} from '../controllers/applicationController';
import { upload } from '../middlewares/uploadMiddleware';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Public: Submit Application
router.post(
  '/',
  upload.fields([
    { name: 'passportCopy', maxCount: 1 },
    { name: 'personalPhoto', maxCount: 1 },
  ]),
  createApplication as any,
);

// Admin: Get All Applications
router.get('/', authenticate, getApplications as any);

// Admin: Download attachment (proxied through server)
// IMPORTANT: This must be defined BEFORE /:id to prevent Express from
// matching "attachments" as an application ID parameter
router.get(
  '/attachments/:id/download',
  authenticate,
  downloadAttachment as any,
);

// Admin: Get Application Details
router.get('/:id', authenticate, getApplicationById as any);

// Admin: Update Status
router.patch('/:id/status', authenticate, updateApplicationStatus as any);

export default router;
