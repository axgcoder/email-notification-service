export const EMAIL_QUEUE_NAME = 'email-queue';
export const SEND_EMAIL_JOB_NAME = 'send-email';

export interface IQueueService {
  addJob(name: string, data: any): Promise<void>;
}
