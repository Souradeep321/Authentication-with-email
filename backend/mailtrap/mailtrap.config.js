// Looking to send emails in production? Check out our Email API/SMTP product!
import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config({
  path: "backend/.env",
});

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server connection verified');
    return true;
  } catch (error) {
    console.error('❌ Email connection failed:', error);
    return false;
  }
};

export default transporter;