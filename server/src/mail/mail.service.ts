import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ukr.net',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const url = `${frontendUrl}/verify?token=${token}`;

    await this.transporter.sendMail({
      from: `"RailPlan Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Welcome to RailPlan! Confirm your email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #387676; text-align: center;">Welcome to RailPlan! 🚊</h2>
          <p>Thank you for registering. Please confirm your email address to activate your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background-color: #387676; color: white; padding: 12px 24px; text-decoration: none; border-radius: 20px; font-weight: bold; display: inline-block;">
              Confirm My Account
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="font-size: 12px; color: #387676; word-break: break-all;">${url}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 20px;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">If you didn't create this account, you can safely ignore this email.</p>
        </div>
      `,
    });
  }
}
