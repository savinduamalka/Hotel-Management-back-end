import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter with your email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true' || false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // Add these options for better Gmail compatibility
  tls: {
    rejectUnauthorized: false,
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
  logger: process.env.NODE_ENV === 'development',
});

// Generate 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Send OTP email
export function sendOtpEmail(email, otp, userName = '') {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: email,
    subject: 'Email Verification - OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #2c5aa0; text-align: center; margin-bottom: 20px;">
            Welcome to ${process.env.EMAIL_FROM_NAME}!
          </h2>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Hello ${userName ? userName : 'there'},
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Thank you for registering with us! To complete your account verification, please use the following OTP code:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f0f8ff; border: 2px dashed #2c5aa0; border-radius: 8px; padding: 20px; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; color: #2c5aa0; letter-spacing: 5px;">
                ${otp}
              </span>
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            <strong>Important:</strong> This OTP is valid for 10 minutes only. Please do not share this code with anyone for security reasons.
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            If you didn't request this verification, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      </div>
    `,
    text: `
      Welcome to ${process.env.EMAIL_FROM_NAME}!
      
      Thank you for registering with us! 
      Your OTP verification code is: ${otp}
      
      This code is valid for 10 minutes only.
      Please do not share this code with anyone.
      
      If you didn't request this verification, please ignore this email.
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Send welcome email after successful verification
export function sendWelcomeEmail(email, userName) {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: email,
    subject: 'Welcome! Your Account is Verified',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #28a745; text-align: center; margin-bottom: 20px;">
            🎉 Account Successfully Verified!
          </h2>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Hello ${userName},
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Congratulations! Your email has been successfully verified and your account is now active.
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            You can now enjoy all the features and services we offer. Thank you for choosing ${process.env.EMAIL_FROM_NAME}!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://hotel-management-front-end-beige.vercel.app/" style="background-color: #2c5aa0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Start Exploring
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Welcome aboard! We're excited to have you with us.
          </p>
        </div>
      </div>
    `,
    text: `
      🎉 Account Successfully Verified!
      
      Hello ${userName},
      
      Congratulations! Your email has been successfully verified and your account is now active.
      
      You can now enjoy all the features and services we offer. Thank you for choosing ${process.env.EMAIL_FROM_NAME}!
      
      Welcome aboard! We're excited to have you with us.
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Send password reset OTP email
export function sendPasswordResetOtp(email, otp, userName = '') {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: email,
    subject: 'Password Reset - OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #dc3545; text-align: center; margin-bottom: 20px;">
            🔐 Password Reset Request
          </h2>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Hello ${userName || 'there'},
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            We received a request to reset your password for your ${
              process.env.EMAIL_FROM_NAME
            } account. Use the following OTP code to reset your password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #fff5f5; border: 2px dashed #dc3545; border-radius: 8px; padding: 20px; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; color: #dc3545; letter-spacing: 5px;">
                ${otp}
              </span>
            </div>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.6;">
              <strong>⚠️ Security Notice:</strong> This OTP is valid for 10 minutes only. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
            </p>
          </div>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            After entering the OTP, you'll be able to set a new password for your account.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated message, please do not reply to this email.<br>
            If you have any concerns, please contact our support team.
          </p>
        </div>
      </div>
    `,
    text: `
      🔐 Password Reset Request
      
      Hello ${userName || 'there'},
      
      We received a request to reset your password for your ${
        process.env.EMAIL_FROM_NAME
      } account.
      
      Your password reset OTP code is: ${otp}
      
      This code is valid for 10 minutes only.
      
      If you didn't request a password reset, please ignore this email and your password will remain unchanged.
      
      After entering the OTP, you'll be able to set a new password for your account.
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Send password reset confirmation email
export function sendPasswordResetConfirmation(email, userName = '') {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: email,
    subject: 'Password Successfully Reset',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #28a745; text-align: center; margin-bottom: 20px;">
            ✅ Password Successfully Reset
          </h2>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Hello ${userName || 'there'},
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Your password has been successfully reset for your ${
              process.env.EMAIL_FROM_NAME
            } account.
          </p>
          
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p style="color: #155724; font-size: 14px; margin: 0; line-height: 1.6;">
              <strong>🔒 Security Info:</strong> If you didn't make this change, please contact our support team immediately.
            </p>
          </div>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            You can now log in to your account using your new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://hotel-management-front-end-beige.vercel.app/login" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Login to Your Account
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      </div>
    `,
    text: `
      ✅ Password Successfully Reset
      
      Hello ${userName || 'there'},
      
      Your password has been successfully reset for your ${
        process.env.EMAIL_FROM_NAME
      } account.
      
      You can now log in to your account using your new password.
      
      If you didn't make this change, please contact our support team immediately.
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Test email configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Email configuration is valid and ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log(
      '1. Check if 2-Factor Authentication is enabled on your Gmail account'
    );
    console.log(
      '2. Generate an App Password: https://myaccount.google.com/apppasswords'
    );
    console.log(
      '3. Use the App Password (16 characters) instead of your regular password'
    );
    console.log(
      '4. Update your .env file with the correct EMAIL_USER and EMAIL_PASSWORD'
    );
    return false;
  }
}
