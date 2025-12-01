import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { EmailPayload } from '../utils/validation';

export interface EmailClient {
  sendEmail(payload: EmailPayload): Promise<void>;
}

export class EmailService implements EmailClient {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (env.SMTP_HOST) {
      const transportOptions: any = {
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
      };

      if (env.SMTP_USER && env.SMTP_PASS) {
        transportOptions.auth = {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        };
      }

      this.transporter = nodemailer.createTransport(transportOptions);
    } else {
      // Fallback for development/testing - logs to console
      this.transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
      console.log('EmailService initialized in JSON transport mode (no SMTP configured)');
    }
  }

  async sendEmail(payload: EmailPayload): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: env.SMTP_USER || 'noreply@example.com',
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      });

      console.log('Message sent: %s', info.messageId);
      if (env.SMTP_HOST) {
        // Preview only available when sending through an Ethereal account or similar
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      } else {
        console.log('Email Content:', info.message);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
