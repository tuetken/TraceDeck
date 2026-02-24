import 'dotenv/config';
import { Worker } from 'bullmq';
import { createRedisConnection } from './queue.js';

const worker = new Worker(
  'ingest',
  async (job) => {
    console.log(`[worker] Processing job ${job.id}:`, job.data);
  },
  { connection: createRedisConnection() }
);

worker.on('completed', (job) => {
  console.log(`[worker] Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[worker] Job ${job?.id} failed:`, err.message);
});
