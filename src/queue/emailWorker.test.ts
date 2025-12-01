import { Job } from 'bullmq';
import { createEmailJobProcessor } from './emailWorker';
import type { EmailClient } from '../services/emailService';

describe('emailWorker job processor', () => {
  it('calls EmailClient.sendEmail with the job data', async () => {
    const sendEmailMock = jest.fn().mockResolvedValue(undefined);
    const client: EmailClient = {
      sendEmail: sendEmailMock,
    };

    const processor = createEmailJobProcessor(client);

    const payload = {
      to: 'worker-test@example.com',
      subject: 'Worker Subject',
      text: 'Worker Body',
      html: '<p>Worker Body</p>',
    };

    const job = {
      id: 'job-1',
      data: payload,
    } as unknown as Job;

    await processor(job);

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    expect(sendEmailMock).toHaveBeenCalledWith(payload);
  });

  it('propagates errors from EmailClient.sendEmail', async () => {
    const sendEmailMock = jest.fn().mockRejectedValue(new Error('send failed'));
    const client: EmailClient = {
      sendEmail: sendEmailMock,
    };

    const processor = createEmailJobProcessor(client);

    const job = {
      id: 'job-2',
      data: {
        to: 'worker-test@example.com',
        subject: 'Subject',
        text: 'Body',
      },
    } as unknown as Job;

    await expect(processor(job)).rejects.toThrow('send failed');
  });
});
