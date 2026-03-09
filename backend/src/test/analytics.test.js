import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import db from '../lib/db.js';
import { seedTestUser, cleanTestUser, buildTestApp } from './helpers.js';

let app;
let testUser;
let projectId;
let endpointId;

beforeAll(async () => {
  testUser = await seedTestUser('analytics');
  app = buildTestApp(testUser);

  const project = await db.project.create({
    data: { userId: testUser.id, name: 'Analytics Test Project' },
  });
  projectId = project.id;

  const endpoint = await db.endpoint.create({
    data: { projectId, method: 'GET', path: '/items' },
  });
  endpointId = endpoint.id;
});

afterAll(async () => {
  await cleanTestUser(testUser.id);
});

describe('Analytics — empty project', () => {
  it('GET summary returns zero counts when there are no logs', async () => {
    const res = await request(app).get(`/projects/${projectId}/analytics/summary`);
    expect(res.status).toBe(200);
    expect(res.body.totalRequests).toBe(0);
    expect(res.body.statusCodes).toEqual([]);
  });

  it('GET endpoints returns an empty array when there are no logs', async () => {
    const res = await request(app).get(`/projects/${projectId}/analytics/endpoints`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('Analytics — with seeded logs', () => {
  beforeAll(async () => {
    // Seed logs directly via Prisma (bypasses the queue, tests query logic only)
    await db.requestLog.createMany({
      data: [
        { endpointId, statusCode: 200, responseTimeMs: 100 },
        { endpointId, statusCode: 200, responseTimeMs: 200 },
        { endpointId, statusCode: 500, responseTimeMs: 900 },
      ],
    });
  });

  it('GET summary returns correct totalRequests and status code breakdown', async () => {
    const res = await request(app).get(`/projects/${projectId}/analytics/summary`);
    expect(res.status).toBe(200);
    expect(res.body.totalRequests).toBe(3);
    const codes = res.body.statusCodes;
    expect(codes.find((c) => c.statusCode === 200).count).toBe(2);
    expect(codes.find((c) => c.statusCode === 500).count).toBe(1);
  });

  it('GET endpoints returns per-endpoint row with correct count and avg response time', async () => {
    const res = await request(app).get(`/projects/${projectId}/analytics/endpoints`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].requestCount).toBe(3);
    expect(res.body[0].avgResponseTimeMs).toBe(400); // (100+200+900) / 3
    expect(res.body[0].method).toBe('GET');
    expect(res.body[0].path).toBe('/items');
  });

  it('GET summary with ?from in the future returns zero results', async () => {
    const res = await request(app).get(
      `/projects/${projectId}/analytics/summary?from=2099-01-01T00:00:00Z`
    );
    expect(res.status).toBe(200);
    expect(res.body.totalRequests).toBe(0);
  });
});
