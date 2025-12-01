import { Request, Response } from 'express';
import { IQueueService, SEND_EMAIL_JOB_NAME } from '../queue/queue.interface';
import { emailSchema } from '../utils/validation';

export class NotificationController {
  constructor(private readonly queueService: IQueueService) {}

  // Use an arrow function to preserve `this` when passed as a handler
  sendEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = emailSchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({ error: result.error.issues });
        return;
      }

      const { to, subject, text, html } = result.data;

      await this.queueService.addJob(SEND_EMAIL_JOB_NAME, { to, subject, text, html });

      res.status(202).json({ message: 'Email queued successfully' });
    } catch (error) {
      console.error('Error queuing email:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}
