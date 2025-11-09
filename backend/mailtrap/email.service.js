// mailtrap/email.service.js
import transporter from './mailtrap.config.js';
import EmailTemplate from './emailTemplates.js';
import dotenv from 'dotenv';

dotenv.config({
    path: 'backend/.env'
});

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'souradeephazra93@gmail.com',
            to: email,
            subject: "Verify Your Email Address",
            html: EmailTemplate.verificationEmail(verificationToken),
            text: `Your verification code is: ${verificationToken}. This code will expire in 24 hours.`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Verification email sent to: ${email}`);
        return info;
    } catch (error) {
        console.error(`❌ Failed to send verification email to ${email}:`, error);
        throw new Error('Failed to send verification email');
    }
};

export const sendWelcomeEmail = async (email, userName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'souradeephazra93@gmail.com',
            to: email,
            subject: "Welcome to Our App! 🎉",
            html: EmailTemplate.welcomeEmail(userName),
            text: `Welcome ${userName}! Your account has been successfully verified and is now active.`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to: ${email}`);
        return info;
    } catch (error) {
        console.error(`❌ Failed to send welcome email to ${email}:`, error);
        // Don't throw error for welcome email - it's not critical
    }
};

// mailtrap/email.service.js
export const sendPasswordResetEmail = async (email, resetUrl) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Auth App" <noreply@authapp.com>',
            to: email,
            subject: "Reset Your Password",
            html: EmailTemplate.passwordResetEmail(resetUrl, email),
            text: `Reset your password by visiting: ${resetUrl} \nThis link expires in 1 hour.`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset email sent to: ${email}`);
        return info;
    } catch (error) {
        console.error(`❌ Failed to send password reset email to ${email}:`, error);
        throw new Error('Failed to send password reset email');
    }
};

export const sendPasswordResetSuccessEmail = async (email, userName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Auth App" <noreply@authapp.com>',
            to: email,
            subject: "Password Reset Successful",
            html: EmailTemplate.passwordResetSuccess(userName),
            text: `Hello ${userName}, your password has been successfully reset.`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset success email sent to: ${email}`);
        return info;
    } catch (error) {
        console.error(`❌ Failed to send password reset success email to ${email}:`, error);
        // Don't throw error for password reset success email - it's not critical
    }
};