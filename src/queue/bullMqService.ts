import { Queue } from 'bullmq';
import { EMAIL_QUEUE_NAME, IQueueService } from './queue.interface';
import { redisConnection } from './queueConfig';

export class BullMqService implements IQueueService {
  private readonly queue: Queue;

  constructor() {
    this.queue = new Queue(EMAIL_QUEUE_NAME, { connection: redisConnection });
  }

  async addJob(name: string, data: any): Promise<void> {
    await this.queue.add(name, data);
  }
}

export const emailQueueService = new BullMqService();
