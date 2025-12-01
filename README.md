# Notification Service

A robust, scalable notification service built with Node.js, TypeScript, Express, and BullMQ. This service handles email notifications asynchronously using a Redis-backed queue system.

## Features

- **Asynchronous Email Sending**: Uses BullMQ and Redis to queue email jobs for reliable delivery.
- **Queue Abstraction**: Designed with an `IQueueService` interface to allow easy swapping of queue implementations (e.g., RabbitMQ).
- **Type Safety**: Built with TypeScript for static type checking.
- **Validation**: Request validation using Zod.
- **Email Provider**: Uses Nodemailer for flexible email transport (SMTP, SES, SendGrid, etc.).

## Architecture & Data Flow

The service follows an asynchronous, event-driven architecture to ensure reliability and scalability.

1.  **Request**: The client sends a POST request to `/email`.
2.  **Validation**: The API validates the payload using Zod schemas.
3.  **Queueing**: If valid, the API pushes a job to the Redis queue via `BullMqService` and immediately responds to the client. This prevents the client from waiting for the actual email delivery.
4.  **Processing**: A background worker (running in the same process for simplicity, but scalable to separate processes) picks up the job from Redis.
5.  **Delivery**: The worker uses `EmailService` to send the email via the configured SMTP server (Maildev).

## Prerequisites

- **Node.js**: v18 or higher
- **Redis**: A running Redis instance (default: `localhost:6379`)
- **Maildev**: For local email testing (optional but recommended)

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/axgcoder/email-notification-service.git
    cd notification-service
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the project (this will automatically start Redis and Maildev via Docker):
    ```bash
    npm run dev
    ```

    *Note: Ensure Docker is running before executing this command.*

## Configuration

1.  Create a `.env` file in the root directory:

    ```env
    PORT=3000
    REDIS_HOST=localhost
    REDIS_PORT=6379
    
    # SMTP Configuration (Maildev)
    SMTP_HOST=localhost
    SMTP_PORT=1025
    # SMTP_USER=
    # SMTP_PASS=
    ```

## Running the Project

### Development
Run the server in development mode with hot-reloading:
```bash
npm run dev
```

### Production
Build the project and start the production server:
```bash
npm run build
npm start
```

## Testing

Run unit tests using Jest:
```bash
npm test
```

## API Documentation

### POST /email

Queue an email for sending.

**Request Body:**
```json
{
  "to": "user@example.com",
  "subject": "Welcome!",
  "text": "Hello world",
  "html": "<p>Hello world</p>" // Optional
}
```

**Response:**
- `202 Accepted`: Email queued successfully.
- `400 Bad Request`: Validation error.

## Project Structure

```
src/
├── config/         # Environment configuration
├── controllers/    # API Controllers
├── queue/          # Queue service and worker implementation
├── services/       # Email sending logic
├── utils/          # Validation schemas and helpers
├── app.ts          # Express app setup
└── index.ts        # Server entry point
```
