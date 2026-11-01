import { Router } from 'express';
import { createPaymentCheckout } from '../controllers/paymentController';

const router = Router();

// Public: Start a checkout with whichever payment provider is active
router.post('/checkout', createPaymentCheckout as any);

export default router;
