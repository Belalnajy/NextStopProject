import nodemailer from 'nodemailer';
import { AppDataSource } from '../config/data-source';
import { Settings } from '../entities/Settings';
import { EmailTemplate, EmailType } from '../entities/EmailTemplate';

// Default SMTP config (should be replaced by settings in a real app or env vars)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (
  to: string,
  type: EmailType,
  variables: Record<string, string>,
) => {
  const settingsRepo = AppDataSource.getRepository(Settings);
  const templateRepo = AppDataSource.getRepository(EmailTemplate);

  const settings = await settingsRepo.findOne({ where: { id: 1 } });

  if (settings && !settings.email_notifs && type !== EmailType.PASSWORD_RESET) {
    console.log('Email notifications disabled');
    return;
  }

  const template = await templateRepo.findOneBy({ type });

  if (!template) {
    console.error(`Email template for ${type} not found`);
    return;
  }

  let subject = template.subject;
  let html = template.body_html;

  // Replace variables
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(regex, variables[key]);
    html = html.replace(regex, variables[key]);
  });

  try {
    // If SMTP is not fully configured, fall back to console logging in development
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('--- TEST EMAIL PREVIEW ---');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${html}`);
      console.log('--------------------------');
      return;
    }

    await transporter.sendMail({
      from: `"${settings?.site_name || 'NextStop Visa'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email, falling back to console log:');
    console.log('--- TEST EMAIL PREVIEW ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    console.log('--------------------------');
  }
};

export const initializeTemplates = async () => {
  const templateRepo = AppDataSource.getRepository(EmailTemplate);
  const count = await templateRepo.count();

  if (count === 0) {
    const templates = [
      {
        type: EmailType.WELCOME,
        subject: 'Welcome to NextStop Visa',
        body_html:
          '<h1>Welcome, {{name}}!</h1><p>Thank you for registering.</p>',
        variables_description: 'name',
      },
      {
        type: EmailType.APPLICATION_RECEIVED,
        subject: 'Application Received: {{appNo}}',
        body_html:
          '<h1>Application Received</h1><p>Dear {{name}}, we have received your application {{appNo}}.</p>',
        variables_description: 'name, appNo',
      },
      {
        type: EmailType.STATUS_UPDATE,
        subject: 'Application Status Update: {{appNo}}',
        body_html:
          '<h1>Status Updated</h1><p>Dear {{name}}, the status of your application {{appNo}} has been updated to: <b>{{status}}</b>.</p>',
        variables_description: 'name, appNo, status',
      },
      // Add more defaults
    ];

    for (const t of templates) {
      const temp = templateRepo.create(t as any);
      await templateRepo.save(temp);
    }
    console.log('Email templates initialized');
  }
};
