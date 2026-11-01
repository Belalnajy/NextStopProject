import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Application, PaymentStatus } from '../entities/Application';
import { createCheckout as createLemonSqueezyCheckout } from './lemonsqueezyController';

const appRepo = AppDataSource.getRepository(Application);

type PaymentProvider = 'demo' | 'lemonsqueezy';

/**
 * Which checkout the site uses. Until the PayTabs account is live the site
 * runs a demo checkout, so the whole application flow can be reviewed
 * without a real payment. Set PAYMENT_PROVIDER=lemonsqueezy to switch back.
 */
export const getPaymentProvider = (): PaymentProvider =>
  process.env.PAYMENT_PROVIDER === 'lemonsqueezy' ? 'lemonsqueezy' : 'demo';

/**
 * POST /api/payments/checkout
 * Returns the URL the visitor should be sent to in order to pay.
 */
export const createPaymentCheckout = async (req: Request, res: Response) => {
  if (getPaymentProvider() === 'lemonsqueezy') {
    return createLemonSqueezyCheckout(req, res);
  }

  try {
    const { applicationId } = req.body;

    if (!applicationId) {
      return res.status(400).json({ message: 'applicationId is required' });
    }

    const application = await appRepo.findOneBy({ id: applicationId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.payment_status === PaymentStatus.PAID) {
      return res.status(400).json({ message: 'Application is already paid' });
    }

    // The demo checkout never charges anything, so the application stays
    // UNPAID in the dashboard.
    res.json({
      provider: 'demo',
      checkoutUrl: `/checkout/demo?app=${application.id}`,
    });
  } catch (error: any) {
    console.error('Demo checkout creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
