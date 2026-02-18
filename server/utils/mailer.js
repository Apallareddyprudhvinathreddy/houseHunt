const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendMail({ to, subject, text, html }) {
  if (!transporter) {
    console.warn('SMTP not configured; skipping email.');
    return;
  }
  const from = process.env.SMTP_FROM || 'no-reply@example.com';
  return transporter.sendMail({ from, to, subject, text, html });
}

module.exports = { sendMail };
