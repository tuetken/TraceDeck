import 'dotenv/config';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export function createRedisConnection() {
  return new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
}

export const ingestQueue = new Queue('ingest', { connection: createRedisConnection() });
