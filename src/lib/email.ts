// src/lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.GMAIL_HOST || 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendVerificationEmail(email: string, code: string, name: string) {
  const mailOptions = {
    from: `"Interview BD" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - Interview BD',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Interview BD</h1>
            <p>World's Largest Interview Question Platform</p>
          </div>
          <div class="content">
            <h2>Hello ${name}! 👋</h2>
            <p>Welcome to <strong>Interview BD</strong> - your ultimate destination for interview preparation!</p>
            <p>To complete your registration, please verify your email address using the code below:</p>
            
            <div class="code-box">
              <p style="margin: 0; font-size: 14px; color: #666;">Your Verification Code</p>
              <div class="code">${code}</div>
            </div>
            
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            <p>If you didn't create an account with Interview BD, please ignore this email.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="margin: 0;"><strong>Why Interview BD?</strong></p>
              <ul style="color: #666;">
                <li>Access thousands of real interview questions</li>
                <li>Learn from verified professionals</li>
                <li>Connect with job seekers and experts</li>
                <li>Stay updated with latest interview trends</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 Interview BD. All rights reserved.</p>
            <p>World's Largest Interview Question Platform</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendWelcomeEmail(email: string, name: string) {
  const mailOptions = {
    from: `"Interview BD" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Interview BD! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .feature-box { background: white; padding: 20px; margin: 15px 0; border-left: 4px solid #667eea; border-radius: 5px; }
          .cta-button { display: inline-block; padding: 15px 40px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 36px;">🎉 Welcome!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">You're now part of Interview BD</p>
          </div>
          <div class="content">
            <h2>Hello ${name}! 👋</h2>
            <p>Congratulations! Your email has been verified and your account is now active.</p>
            <p>You've just joined <strong>the world's largest interview question platform</strong> with thousands of verified professionals and job seekers.</p>
            
            <h3 style="color: #667eea; margin-top: 30px;">🚀 Get Started:</h3>
            
            <div class="feature-box">
              <h4 style="margin: 0 0 10px 0;">📚 Browse Questions</h4>
              <p style="margin: 0; color: #666;">Explore thousands of interview questions across various fields and categories.</p>
            </div>
            
            <div class="feature-box">
              <h4 style="margin: 0 0 10px 0;">✍️ Share Your Knowledge</h4>
              <p style="margin: 0; color: #666;">Contribute by posting questions and answers from your interview experiences.</p>
            </div>
            
            <div class="feature-box">
              <h4 style="margin: 0 0 10px 0;">🤝 Connect & Network</h4>
              <p style="margin: 0; color: #666;">Connect with professionals and build your network in your field.</p>
            </div>
            
            <div class="feature-box">
              <h4 style="margin: 0 0 10px 0;">✅ Get Verified</h4>
              <p style="margin: 0; color: #666;">Complete your profile verification to unlock premium features and gain credibility.</p>
            </div>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="cta-button">
                Start Exploring →
              </a>
            </center>
            
            <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404;"><strong>💡 Pro Tip:</strong> Complete your verification to get a verified badge and access exclusive features!</p>
            </div>
          </div>
          <div class="footer">
            <p>Need help? Reply to this email or visit our help center.</p>
            <p>© 2024 Interview BD. All rights reserved.</p>
            <p>World's Largest Interview Question Platform</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, resetToken: string, name: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: `"Interview BD" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password - Interview BD',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; padding: 15px 40px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .security-note { background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
            <p>Interview BD - Secure Account Recovery</p>
          </div>
          <div class="content">
            <h2>Hello ${name}! 👋</h2>
            <p>We received a request to reset your password for your Interview BD account.</p>
            
            <div class="warning-box">
              <p style="margin: 0; color: #856404;"><strong>⚠️ Important:</strong> This link will expire in <strong>1 hour</strong> for security reasons.</p>
            </div>
            
            <p>Click the button below to reset your password:</p>
            
            <center>
              <a href="${resetUrl}" class="button">Reset Password →</a>
            </center>
            
            <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
            <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #667eea;">${resetUrl}</p>
            
            <div class="security-note">
              <p style="margin: 0 0 10px 0; color: #1976D2;"><strong>🛡️ Security Tips:</strong></p>
              <ul style="margin: 0; padding-left: 20px; color: #1976D2;">
                <li>Never share your password with anyone</li>
                <li>Use a strong, unique password</li>
                <li>Enable two-factor authentication if available</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 14px;"><strong>Didn't request this?</strong></p>
              <p style="color: #666; font-size: 14px;">If you didn't request a password reset, please ignore this email. Your password will remain unchanged, and your account is secure.</p>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>© 2024 Interview BD. All rights reserved.</p>
            <p>World's Largest Interview Question Platform</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}