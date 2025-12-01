import nodemailer from 'nodemailer';
import { EmailService } from './emailService';

jest.mock('nodemailer');
jest.mock('../config/env', () => ({
  env: {
    SMTP_HOST: 'smtp.example.com',
    SMTP_USER: 'user',
    SMTP_PASS: 'pass',
    SMTP_PORT: '587',
  },
}));

describe('EmailService', () => {
  let emailService: EmailService;
  let sendMailMock: jest.Mock;

  beforeEach(() => {
    sendMailMock = jest.fn().mockResolvedValue({ messageId: 'test-id' });
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });
    emailService = new EmailService();
  });

  it('should send an email successfully', async () => {
    const payload = {
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Body',
    };

    await emailService.sendEmail(payload);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test Body',
      }),
    );
  });
});
