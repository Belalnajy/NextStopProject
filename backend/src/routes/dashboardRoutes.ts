import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Protect all dashboard routes
router.use(authenticate as any);

router.get('/stats', getDashboardStats as any);

export default router;
