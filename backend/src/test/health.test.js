import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

// Mock the BullMQ queue so POST /ingest doesn't require a running Redis instance
vi.mock('../queue.js', () => ({
  ingestQueue: { add: vi.fn().mockResolvedValue(undefined) },
}));

const app = createApp();

describe('GET /health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('POST /ingest', () => {
  it('accepts a log payload and returns 202', async () => {
    const res = await request(app)
      .post('/ingest')
      .send({ projectId: 'any-id', method: 'GET', path: '/test', statusCode: 200, responseTimeMs: 50 });
    expect(res.status).toBe(202);
  });
});
