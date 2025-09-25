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
