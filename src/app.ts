import express from 'express';
import { NotificationController } from './controllers/notificationController';

const app = express();

app.use(express.json());

app.post('/email', NotificationController.sendEmail);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
