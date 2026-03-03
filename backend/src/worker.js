import 'dotenv/config';
import { Worker } from 'bullmq';
import { createRedisConnection } from './queue.js';
import db from './lib/db.js';

const worker = new Worker(
  'ingest',
  async (job) => {
    const { projectId, path, method, statusCode, responseTimeMs, ipAddress, userAgent } = job.data;

    console.log(`[worker] Processing job ${job.id}:`, job.data);

    const project = await db.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error(`Project not found: ${projectId}`);

    const endpoint = await db.endpoint.upsert({
      where: { projectId_method_path: { projectId, method, path } },
      create: { projectId, method, path },
      update: {},
    });

    await db.requestLog.create({
      data: {
        endpointId: endpoint.id,
        statusCode,
        responseTimeMs,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
      },
    });

    console.log(`[worker] Job ${job.id} persisted log for ${method} ${path} (project: ${projectId})`);
  },
  { connection: createRedisConnection() }
);

worker.on('completed', (job) => {
  console.log(`[worker] Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[worker] Job ${job?.id} failed:`, err.message);
});

async function shutdown() {
  await worker.close();
  await db.$disconnect();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
