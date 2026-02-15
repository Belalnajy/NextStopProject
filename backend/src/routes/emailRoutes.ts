import { Router } from 'express';
import {
  getTemplates,
  updateTemplate,
  sendTestEmail,
} from '../controllers/emailController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Admin: Get all templates
router.get('/templates', authenticate, getTemplates as any);

// Admin: Update template
router.put('/templates/:id', authenticate, updateTemplate as any);

// Admin: Send test email
router.post('/test-send', authenticate, sendTestEmail as any);

export default router;
