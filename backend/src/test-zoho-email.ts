import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from the root of the server directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const testEmail = async () => {
  console.log('Testing Zoho SMTP configuration...');
  console.log('Host:', process.env.SMTP_HOST);
  console.log('User:', process.env.SMTP_USER);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Test Support" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to self
      subject: 'Zoho SMTP Test',
      text: 'If you are reading this, the Zoho SMTP configuration is working correctly!',
      html: '<b>If you are reading this, the Zoho SMTP configuration is working correctly!</b>',
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error occurred while sending test email:', error);
  }
};

testEmail();
