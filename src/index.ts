import app from './app';
import { env } from './config/env';
import './queue/emailWorker'; // Initialize worker

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
