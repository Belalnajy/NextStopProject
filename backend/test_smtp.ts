import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function main() {
  try {
    let info = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_USER}>`,
      to: "belalnajy10@gmail.com",
      subject: "Hello Check",
      text: "Testing SMTP configuration.",
    });
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Transporter error: ", err);
  }
}

main();
