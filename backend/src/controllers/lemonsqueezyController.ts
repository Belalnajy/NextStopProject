import { Request, Response } from 'express';
import crypto from 'crypto';
import { AppDataSource } from '../config/data-source';
import { Application, PaymentStatus } from '../entities/Application';
import { sendEmail } from '../services/emailService';
import { EmailType } from '../entities/EmailTemplate';

const appRepo = AppDataSource.getRepository(Application);

const LEMONSQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1';

function getLSHeaders() {
  return {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
  };
}

/**
 * Creates a Lemon Squeezy checkout session for an application.
 * The application must already exist in the DB (created in an earlier step).
 */
export const createCheckout = async (req: Request, res: Response) => {
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

    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

    const checkoutPayload = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: application.email,
            name: application.full_name,
            custom: {
              application_id: application.id,
            },
          },
          product_options: {
            redirect_url: `${process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173'}/apply?payment=success&app=${application.id}`,
            receipt_button_text: 'Return to Application',
            receipt_thank_you_note: `Thank you for your payment! Your application ${application.application_no} is now being processed.`,
          },
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: storeId,
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: variantId,
            },
          },
        },
      },
    };

    const response = await fetch(`${LEMONSQUEEZY_API_URL}/checkouts`, {
      method: 'POST',
      headers: getLSHeaders(),
      body: JSON.stringify(checkoutPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Lemon Squeezy checkout error:', errorData);
      return res.status(response.status).json({
        message: 'Failed to create checkout',
        error: errorData,
      });
    }

    const checkoutData = await response.json();
    const checkoutUrl = checkoutData.data.attributes.url;

    application.lemonsqueezy_checkout_url = checkoutUrl;
    await appRepo.save(application);

    res.json({ checkoutUrl });
  } catch (error: any) {
    console.error('Checkout creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Verifies the webhook signature from Lemon Squeezy using HMAC SHA-256.
 */
function verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

/**
 * Handles Lemon Squeezy webhook events:
 * - order_created: Mark application as PAID
 * - order_refunded: Mark application as UNPAID
 */
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-signature'] as string;

    if (!signature) {
      console.warn('Webhook received without X-Signature header');
      return res.status(401).json({ message: 'Missing signature' });
    }

    const rawBody = (req as any).rawBody as Buffer;
    if (!rawBody) {
      console.error('rawBody not available - check middleware setup');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    if (!verifyWebhookSignature(rawBody, signature)) {
      console.warn('Webhook signature verification failed');
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const event = req.body;
    const eventName = event.meta?.event_name;
    const customData = event.meta?.custom_data;
    const applicationId = customData?.application_id;

    console.log(`[LemonSqueezy Webhook] Event: ${eventName}, Application ID: ${applicationId}`);

    if (!applicationId) {
      console.warn('Webhook received without application_id in custom_data');
      return res.status(200).json({ message: 'No application_id, skipping' });
    }

    const application = await appRepo.findOneBy({ id: applicationId });
    if (!application) {
      console.warn(`Application ${applicationId} not found for webhook`);
      return res.status(200).json({ message: 'Application not found, skipping' });
    }

    switch (eventName) {
      case 'order_created': {
        const orderId = String(event.data?.id || '');
        application.payment_status = PaymentStatus.PAID;
        application.lemonsqueezy_order_id = orderId;
        application.payment_date = new Date();
        await appRepo.save(application);
        console.log(`Application ${applicationId} marked as PAID (Order: ${orderId})`);

        await sendEmail(application.email, EmailType.PAYMENT_CONFIRMED, {
          name: application.full_name,
          appNo: application.application_no,
        });
        break;
      }

      case 'order_refunded': {
        application.payment_status = PaymentStatus.UNPAID;
        await appRepo.save(application);
        console.log(`Application ${applicationId} marked as UNPAID (refunded)`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${eventName}`);
    }

    res.status(200).json({ message: 'Webhook processed' });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

/**
 * Issues a refund via the Lemon Squeezy API for a paid application.
 * Admin-only endpoint.
 */
export const refundOrder = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.body;

    const application = await appRepo.findOneBy({ id: applicationId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.payment_status !== PaymentStatus.PAID) {
      return res.status(400).json({ message: 'Application is not paid' });
    }

    if (!application.lemonsqueezy_order_id) {
      return res.status(400).json({ message: 'No Lemon Squeezy order ID found' });
    }

    const refundPayload = {
      data: {
        type: 'orders',
        id: application.lemonsqueezy_order_id,
      },
    };

    const response = await fetch(
      `${LEMONSQUEEZY_API_URL}/orders/${application.lemonsqueezy_order_id}/refund`,
      {
        method: 'POST',
        headers: getLSHeaders(),
        body: JSON.stringify(refundPayload),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Lemon Squeezy refund error:', errorData);
      return res.status(response.status).json({
        message: 'Failed to process refund',
        error: errorData,
      });
    }

    application.payment_status = PaymentStatus.UNPAID;
    application.payment_date = null as any;
    await appRepo.save(application);

    res.json({ message: 'Refund processed successfully' });
  } catch (error: any) {
    console.error('Refund error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Resend checkout link for an unpaid application.
 * Admin-only endpoint.
 */
export const resendCheckout = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.body;

    const application = await appRepo.findOneBy({ id: applicationId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.payment_status === PaymentStatus.PAID) {
      return res.status(400).json({ message: 'Application is already paid' });
    }

    if (application.lemonsqueezy_checkout_url) {
      return res.json({ checkoutUrl: application.lemonsqueezy_checkout_url });
    }

    return res.status(400).json({ message: 'No checkout URL available' });
  } catch (error: any) {
    console.error('Resend checkout error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
