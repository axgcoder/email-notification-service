import { Request, Response } from 'express';
import { emailQueueService } from '../queue/bullMqService';
import { emailSchema } from '../utils/validation';

export class NotificationController {
  static async sendEmail(req: Request, res: Response): Promise<void> {
    try {
      const result = emailSchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({ error: result.error.issues });
        return;
      }

      const { to, subject, text, html } = result.data;

      await emailQueueService.addJob('send-email', { to, subject, text, html });

      res.status(202).json({ message: 'Email queued successfully' });
    } catch (error) {
      console.error('Error queuing email:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
