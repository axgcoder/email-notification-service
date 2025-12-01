import { Queue, Worker, Job } from 'bullmq';
import { env } from '../config/env';
import { emailService } from '../services/emailService';
import { EmailPayload } from '../utils/validation';
import { IQueueService } from './queue.interface';

const connection = {
  host: env.REDIS_HOST,
  port: parseInt(env.REDIS_PORT),
};

export class BullMqService implements IQueueService {
  private queue: Queue;

  constructor() {
    this.queue = new Queue('email-queue', { connection });
  }

  async addJob(name: string, data: any): Promise<void> {
    await this.queue.add(name, data);
  }
}

export const emailQueueService = new BullMqService();

const worker = new Worker(
  'email-queue',
  async (job: Job) => {
    console.log(`Processing job ${job.id}...`);
    const data = job.data as EmailPayload;
    await emailService.sendEmail(data);
    console.log(`Job ${job.id} completed.`);
  },
  { connection },
);

worker.on('completed', (job: Job) => {
  console.log(`Job ${job.id} has completed!`);
});

worker.on('failed', (job: Job | undefined, err: Error) => {
  console.error(`Job ${job?.id} has failed with ${err.message}`);
});

export { worker };
