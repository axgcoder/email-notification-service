import { Request, Response } from 'express';
import { NotificationController } from './notificationController';
import { SEND_EMAIL_JOB_NAME } from '../queue/queue.interface';

describe('NotificationController', () => {
  let addJobMock: jest.Mock;
  let controller: NotificationController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    addJobMock = jest.fn().mockResolvedValue(undefined);

    controller = new NotificationController({
      addJob: addJobMock,
    });

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  it('queues email and returns 202 for a valid request', async () => {
    req = {
      body: {
        to: 'test@example.com',
        subject: 'Subject',
        text: 'Body',
      },
    } as Partial<Request>;

    await controller.sendEmail(req as Request, res as Response);

    expect(addJobMock).toHaveBeenCalledWith(SEND_EMAIL_JOB_NAME, {
      to: 'test@example.com',
      subject: 'Subject',
      text: 'Body',
      html: undefined,
    });

    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email queued successfully' });
  });

  it('returns 400 and does not enqueue on validation error', async () => {
    req = {
      body: {
        to: 'not-an-email',
        subject: '',
        text: '',
      },
    } as Partial<Request>;

    await controller.sendEmail(req as Request, res as Response);

    expect(addJobMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Array),
      }),
    );
  });

  it('returns 500 when queueService throws', async () => {
    addJobMock.mockRejectedValueOnce(new Error('Queue failure'));

    req = {
      body: {
        to: 'test@example.com',
        subject: 'Subject',
        text: 'Body',
      },
    } as Partial<Request>;

    await controller.sendEmail(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
