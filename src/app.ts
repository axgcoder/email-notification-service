import express from 'express';
import { NotificationController } from './controllers/notificationController';
import { emailQueueService } from './queue/bullMqService';

const app = express();

app.use(express.json());

const notificationController = new NotificationController(emailQueueService);

app.post('/email', notificationController.sendEmail);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
