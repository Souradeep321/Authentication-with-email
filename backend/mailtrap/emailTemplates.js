// mailtrap/emailTemplates.js
export const EmailTemplate = {

    // Email Verification Template
    verificationEmail: (verificationToken) => {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 30px;
        }
        .verification-code {
            background: #f8f9fa;
            border: 2px dashed #667eea;
            padding: 25px;
            text-align: center;
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            margin: 25px 0;
            border-radius: 8px;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        .instructions {
            background: #e7f3ff;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .expiry-note {
            color: #e74c3c;
            font-weight: bold;
            margin: 15px 0;
        }
        .support {
            color: #7f8c8d;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verify Your Email Address</h1>
        </div>
        <div class="content">
            <h2>Hello!</h2>
            <p>Thank you for signing up! To complete your registration and activate your account, please use the verification code below:</p>
            
            <div class="verification-code">${verificationToken}</div>
            
            <div class="instructions">
                <p><strong>How to use this code:</strong></p>
                <ol>
                    <li>Go to the verification page in our app</li>
                    <li>Enter the 6-digit code shown above</li>
                    <li>Click "Verify Email" to complete the process</li>
                </ol>
            </div>
            
            <p class="expiry-note">⚠️ This verification code will expire in 1 hour.</p>
            
            <p>If you didn't create an account with us, please ignore this email. Your email address will not be used.</p>
            
            <p>Best regards,<br><strong>The Authentication Team</strong></p>
        </div>
        <div class="footer">
            <p>If you need help, please contact our support team.</p>
            <p class="support">© ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `;
    },
    // Welcome Email Template (after verification)
    welcomeEmail: (userName) => {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our App!</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
        }
        .content {
            padding: 30px;
        }
        .welcome-message {
            text-align: center;
            margin: 20px 0;
        }
        .features {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .features h3 {
            color: #4facfe;
            margin-top: 0;
        }
        .cta-button {
            display: inline-block;
            background: #4facfe;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .emoji {
            font-size: 48px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Our App! 🎉</h1>
        </div>
        <div class="content">
            <div class="welcome-message">
                <div class="emoji">👋</div>
                <h2>Hello ${userName}!</h2>
            </div>
            
            <p>Congratulations! Your email has been successfully verified and your account is now fully activated.</p>
            
            <div class="features">
                <h3>🚀 Get Started</h3>
                <p>Here's what you can do now:</p>
                <ul>
                    <li>Explore all features of our platform</li>
                    <li>Complete your profile setup</li>
                    <li>Start using our services immediately</li>
                    <li>Access exclusive member benefits</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="#" class="cta-button">Get Started Now</a>
            </div>
            
            <p>If you have any questions or need help getting started, feel free to reply to this email or visit our help center.</p>
            
            <p>We're excited to have you on board!</p>
            <p>Best regards,<br><strong>The Authentication Team</strong></p>
        </div>
        <div class="footer">
            <p>Thank you for choosing us!</p>
            <p>© ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `;
    },
    // Password Reset Template
    // mailtrap/emailTemplates.js

    // Password Reset Email with Link (Simplified)
    passwordResetEmail: (resetUrl, email) => {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 30px;
        }
        .reset-button {
            display: block;
            width: 200px;
            margin: 25px auto;
            padding: 15px 25px;
            background: #f5576c;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
            font-size: 16px;
        }
        .reset-button:hover {
            background: #e74c3c;
        }
        .reset-link {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            word-break: break-all;
            font-size: 14px;
            color: #666;
        }
        .warning {
            background: #ffeaa7;
            border: 1px solid #fdcb6e;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Your Password</h1>
        </div>
        <div class="content">
            <h2>Hello!</h2>
            
            <p>We received a password reset request for your account (${email}). Click the button below to create a new password:</p>
            
            <a href="${resetUrl}" class="reset-button">Reset Password</a>
            
            <p>Or copy and paste this link in your browser:</p>
            <div class="reset-link">${resetUrl}</div>
            
            <div class="warning">
                <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
            </div>
            
            <p>Best regards,<br><strong>The Authentication Team</strong></p>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
    },
    // Password Reset Success Template
    passwordResetSuccess: (userName) => {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 30px;
        }
        .success-icon {
            text-align: center;
            font-size: 48px;
            margin: 20px 0;
        }
        .security-tips {
            background: #d1fae5;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Successful ✅</h1>
        </div>
        <div class="content">
            <div class="success-icon">🎉</div>
            
            <h2>Hello ${userName}!</h2>
            
            <p>Your password has been successfully reset. You can now login to your account with your new password.</p>
            
            <div class="security-tips">
                <h3>🔒 Security Tips:</h3>
                <ul>
                    <li>Use a strong, unique password</li>
                    <li>Don't share your password with anyone</li>
                    <li>Log out from shared devices</li>
                    <li>Enable two-factor authentication if available</li>
                </ul>
            </div>
            
            <p>If you didn't request this password reset, please contact our support team immediately.</p>
            
            <p>Stay secure!<br><strong>The Authentication Team</strong></p>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
    }


};

export default EmailTemplate;