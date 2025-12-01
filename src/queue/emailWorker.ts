import { Job, Worker } from 'bullmq';
import { EMAIL_QUEUE_NAME } from './queue.interface';
import { redisConnection } from './queueConfig';
import { EmailClient, emailService } from '../services/emailService';
import { EmailPayload } from '../utils/validation';

export const createEmailJobProcessor = (client: EmailClient) =>
  async (job: Job): Promise<void> => {
    console.log(`Processing job ${job.id}...`);
    const data = job.data as EmailPayload;
    await client.sendEmail(data);
    console.log(`Job ${job.id} completed.`);
  };

const processor = createEmailJobProcessor(emailService);

export const emailWorker = new Worker(EMAIL_QUEUE_NAME, processor, {
  connection: redisConnection,
});

emailWorker.on('completed', (job: Job) => {
  console.log(`Job ${job.id} has completed!`);
});

emailWorker.on('failed', (job: Job | undefined, err: Error) => {
  console.error(`Job ${job?.id} has failed with ${err.message}`);
});
