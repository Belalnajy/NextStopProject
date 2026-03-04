import { Router } from 'express';
import { createCheckout, handleWebhook, refundOrder, resendCheckout } from '../controllers/lemonsqueezyController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Public: Create a checkout session (called from frontend after application is saved)
router.post('/checkout', createCheckout as any);

// Public: Webhook test (to verify route is reachable)
router.get('/webhook', (_req, res) => {
  res.json({ status: 'Webhook endpoint is reachable' });
});

// Public: Webhook endpoint (called by Lemon Squeezy)
router.post('/webhook', handleWebhook as any);

// Admin: Refund an order
router.post('/refund', authenticate, refundOrder as any);

// Admin: Resend checkout link for unpaid application
router.post('/resend-checkout', authenticate, resendCheckout as any);

export default router;
