import { Resend } from 'resend';
import type { SendVerificationRequestParams } from 'next-auth/providers/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationRequest(params: SendVerificationRequestParams) {
  const { identifier, url, provider } = params;
  
  try {
    // Create verification URL without modifying the callback
    const verificationUrl = new URL(url);
    
    const result = await resend.emails.send({
      from: provider.from,
      to: identifier,
      subject: 'Sign in to Shelther',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1 style="color: #8A4FFF; margin-bottom: 20px;">Welcome to Shelther</h1>
          <p style="margin-bottom: 20px;">Click the button below to verify your email and complete your account setup:</p>
          <a href="${verificationUrl.toString()}" style="background-color: #8A4FFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
          <p style="color: #666; margin-top: 20px; font-size: 14px;">This link will expire in 24 hours.</p>
        </div>
      `,
    });

    if (!result?.data) {
      throw new Error('Failed to send email');
    }

    console.log('Verification email sent:', result);
  } catch (error: any) {
    console.error('Failed to send verification email:', error);
    throw new Error(error.message);
  }
}
