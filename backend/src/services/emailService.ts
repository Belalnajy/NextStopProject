import nodemailer from 'nodemailer';
import { AppDataSource } from '../config/data-source';
import { Settings } from '../entities/Settings';
import { EmailTemplate, EmailType } from '../entities/EmailTemplate';

// Default SMTP config (should be replaced by settings in a real app or env vars)
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

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

    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"${settings?.site_name || 'NextStop Visa'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email, falling back to console log:', error);
    console.log('--- TEST EMAIL PREVIEW ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    console.log('--------------------------');
  }
};

export const initializeTemplates = async () => {
  const templateRepo = AppDataSource.getRepository(EmailTemplate);

  const emailWrapper = (content: string, accentColor: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a2f6b 0%, #0f1d45 100%);padding:32px 40px;border-radius:16px 16px 0 0;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:0.5px;">NextStop Visa</h1>
              <div style="width:50px;height:3px;background:#d4af6e;margin:12px auto 0;border-radius:2px;"></div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:24px 40px;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:none;text-align:center;">
              <p style="margin:0 0 8px;color:#94a3b8;font-size:12px;">This is an automated message from NextStop Visa.</p>
              <p style="margin:0;color:#94a3b8;font-size:12px;">Please do not reply to this email directly.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const approvedBody = emailWrapper(
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:64px;height:64px;background:#dcfce7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:32px;">✓</span>
        </div>
      </div>
      <h2 style="margin:0 0 8px;color:#1a2f6b;font-size:22px;font-weight:700;text-align:center;">Application Approved!</h2>
      <p style="margin:0 0 24px;color:#64748b;font-size:14px;text-align:center;">Congratulations, your visa application has been approved.</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:6px 0;color:#64748b;font-size:13px;width:140px;">Applicant Name</td>
            <td style="padding:6px 0;color:#1e293b;font-size:13px;font-weight:600;">{{name}}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#64748b;font-size:13px;">Application No.</td>
            <td style="padding:6px 0;color:#1e293b;font-size:13px;font-weight:600;">{{appNo}}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#64748b;font-size:13px;">Status</td>
            <td style="padding:6px 0;">
              <span style="display:inline-block;background:#16a34a;color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">Approved</span>
            </td>
          </tr>
        </table>
      </div>
      <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">Dear <strong>{{name}}</strong>,</p>
      <p style="margin:12px 0 0;color:#475569;font-size:14px;line-height:1.6;">We are pleased to inform you that your visa application <strong>{{appNo}}</strong> has been reviewed and <strong style="color:#16a34a;">approved</strong>. You will receive further instructions regarding the next steps shortly.</p>
      <p style="margin:12px 0 0;color:#475569;font-size:14px;line-height:1.6;">Thank you for choosing NextStop Visa.</p>
    `,
      '#16a34a',
    );

    const rejectedBody = emailWrapper(
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:64px;height:64px;background:#fee2e2;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:32px;">✕</span>
        </div>
      </div>
      <h2 style="margin:0 0 8px;color:#1a2f6b;font-size:22px;font-weight:700;text-align:center;">Application Update</h2>
      <p style="margin:0 0 24px;color:#64748b;font-size:14px;text-align:center;">We have an important update regarding your visa application.</p>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:6px 0;color:#64748b;font-size:13px;width:140px;">Applicant Name</td>
            <td style="padding:6px 0;color:#1e293b;font-size:13px;font-weight:600;">{{name}}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#64748b;font-size:13px;">Application No.</td>
            <td style="padding:6px 0;color:#1e293b;font-size:13px;font-weight:600;">{{appNo}}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#64748b;font-size:13px;">Status</td>
            <td style="padding:6px 0;">
              <span style="display:inline-block;background:#dc2626;color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">Rejected</span>
            </td>
          </tr>
        </table>
      </div>
      <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">Dear <strong>{{name}}</strong>,</p>
      <p style="margin:12px 0 0;color:#475569;font-size:14px;line-height:1.6;">We regret to inform you that your visa application <strong>{{appNo}}</strong> has been reviewed and unfortunately could not be approved at this time.</p>
      <p style="margin:12px 0 0;color:#475569;font-size:14px;line-height:1.6;">If you believe this decision was made in error, please do not hesitate to contact our support team for further assistance.</p>
      <p style="margin:12px 0 0;color:#475569;font-size:14px;line-height:1.6;">Thank you for your understanding.</p>
    `,
      '#dc2626',
    );

    const welcomeBody = emailWrapper(
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:64px;height:64px;background:#dbeafe;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:32px;">👋</span>
        </div>
      </div>
      <h2 style="margin:0 0 8px;color:#1a2f6b;font-size:22px;font-weight:700;text-align:center;">Welcome to NextStop Visa!</h2>
      <p style="margin:0 0 24px;color:#64748b;font-size:14px;text-align:center;">Thank you for creating your account with us.</p>
      <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">Dear <strong>{{name}}</strong>,</p>
      <p style="margin:12px 0 0;color:#475569;font-size:14px;line-height:1.6;">We are thrilled to have you on board! Your account has been successfully created. You can now submit your visa application and track its progress through our platform.</p>
      <p style="margin:12px 0 0;color:#475569;font-size:14px;line-height:1.6;">If you have any questions, feel free to reach out to our support team at any time.</p>
    `,
      '#1a2f6b',
    );

    const receivedBody = emailWrapper(
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:64px;height:64px;background:#fef3c7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:32px;">📋</span>
        </div>
      </div>
      <h2 style="margin:0 0 8px;color:#1a2f6b;font-size:22px;font-weight:700;text-align:center;">Application Received</h2>
      <p style="margin:0 0 24px;color:#64748b;font-size:14px;text-align:center;">We have successfully received your visa application.</p>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:6px 0;color:#64748b;font-size:13px;width:140px;">Applicant Name</td>
            <td style="padding:6px 0;color:#1e293b;font-size:13px;font-weight:600;">{{name}}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#64748b;font-size:13px;">Application No.</td>
            <td style="padding:6px 0;color:#1e293b;font-size:13px;font-weight:600;">{{appNo}}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#64748b;font-size:13px;">Status</td>
            <td style="padding:6px 0;">
              <span style="display:inline-block;background:#d97706;color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">Under Review</span>
            </td>
          </tr>
        </table>
      </div>
      <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">Dear <strong>{{name}}</strong>,</p>
      <p style="margin:12px 0 0;color:#475569;font-size:14px;line-height:1.6;">Your visa application <strong>{{appNo}}</strong> has been received and is now under review. Our team will process your application as quickly as possible.</p>
      <p style="margin:12px 0 0;color:#475569;font-size:14px;line-height:1.6;">You will receive an email notification once a decision has been made. Thank you for your patience.</p>
    `,
      '#d97706',
    );

    const statusUpdateBody = emailWrapper(
      `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:64px;height:64px;background:#e0e7ff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:32px;">🔔</span>
        </div>
      </div>
      <h2 style="margin:0 0 8px;color:#1a2f6b;font-size:22px;font-weight:700;text-align:center;">Status Update</h2>
      <p style="margin:0 0 24px;color:#64748b;font-size:14px;text-align:center;">The status of your application has been updated.</p>
      <div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:6px 0;color:#64748b;font-size:13px;width:140px;">Applicant Name</td>
            <td style="padding:6px 0;color:#1e293b;font-size:13px;font-weight:600;">{{name}}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#64748b;font-size:13px;">Application No.</td>
            <td style="padding:6px 0;color:#1e293b;font-size:13px;font-weight:600;">{{appNo}}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#64748b;font-size:13px;">New Status</td>
            <td style="padding:6px 0;">
              <span style="display:inline-block;background:#1a2f6b;color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">{{status}}</span>
            </td>
          </tr>
        </table>
      </div>
      <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">Dear <strong>{{name}}</strong>,</p>
      <p style="margin:12px 0 0;color:#475569;font-size:14px;line-height:1.6;">We would like to inform you that the status of your visa application <strong>{{appNo}}</strong> has been updated to <strong>{{status}}</strong>.</p>
      <p style="margin:12px 0 0;color:#475569;font-size:14px;line-height:1.6;">If you have any questions, please don't hesitate to contact us.</p>
    `,
      '#1a2f6b',
    );

    const templates = [
      {
        type: EmailType.WELCOME,
        subject: '🎉 Welcome to NextStop Visa!',
        body_html: welcomeBody,
        variables_description: 'name',
      },
      {
        type: EmailType.APPLICATION_RECEIVED,
        subject: '📋 Application Received: {{appNo}}',
        body_html: receivedBody,
        variables_description: 'name, appNo',
      },
      {
        type: EmailType.STATUS_UPDATE,
        subject: '🔔 Application Status Update: {{appNo}}',
        body_html: statusUpdateBody,
        variables_description: 'name, appNo, status',
      },
      {
        type: EmailType.APPLICATION_APPROVED,
        subject: '✅ Application Approved: {{appNo}}',
        body_html: approvedBody,
        variables_description: 'name, appNo',
      },
      {
        type: EmailType.APPLICATION_REJECTED,
        subject: '❌ Application Update: {{appNo}}',
        body_html: rejectedBody,
        variables_description: 'name, appNo',
      },
    ];

    for (const t of templates) {
      const exists = await templateRepo.findOneBy({ type: t.type });
      if (exists) {
        // Update existing templates with new design
        exists.subject = t.subject;
        exists.body_html = t.body_html;
        exists.variables_description = t.variables_description;
        await templateRepo.save(exists);
      } else {
        const temp = templateRepo.create(t as any);
        await templateRepo.save(temp);
      }
    }
    console.log('Email templates initialization checked');
  } catch (error) {
    console.error('Failed to initialize templates:', error);
  }
};
