import { Router } from 'express';
import {
  convertCurrency,
  getCurrencyInfo,
} from '../controllers/currencyController';

const router = Router();

// Public: detect the visitor's currency from their IP + return exchange rates
router.get('/', getCurrencyInfo as any);

// Public: convert an amount between currencies (display only)
router.get('/convert', convertCurrency as any);

export default router;
