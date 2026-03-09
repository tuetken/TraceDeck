import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import db from '../lib/db.js';
import { seedTestUser, cleanTestUser, buildTestApp } from './helpers.js';

let app;
let testUser;
let projectId;

beforeAll(async () => {
  testUser = await seedTestUser('endpoints');
  app = buildTestApp(testUser);
  const project = await db.project.create({
    data: { userId: testUser.id, name: 'Endpoint Test Project' },
  });
  projectId = project.id;
});

afterAll(async () => {
  await cleanTestUser(testUser.id);
});

describe('Endpoints CRUD', () => {
  let endpointId;

  it('POST /projects/:id/endpoints creates an endpoint and returns 201', async () => {
    const res = await request(app)
      .post(`/projects/${projectId}/endpoints`)
      .send({ method: 'GET', path: '/users' });
    expect(res.status).toBe(201);
    expect(res.body.method).toBe('GET');
    expect(res.body.path).toBe('/users');
    endpointId = res.body.id;
  });

  it('GET /projects/:id/endpoints returns an array containing the created endpoint', async () => {
    const res = await request(app).get(`/projects/${projectId}/endpoints`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((e) => e.id === endpointId)).toBe(true);
  });

  it('GET /projects/:id/endpoints/:endpointId returns the correct endpoint', async () => {
    const res = await request(app).get(`/projects/${projectId}/endpoints/${endpointId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(endpointId);
    expect(res.body.path).toBe('/users');
  });

  it('PUT /projects/:id/endpoints/:endpointId updates the endpoint', async () => {
    const res = await request(app)
      .put(`/projects/${projectId}/endpoints/${endpointId}`)
      .send({ method: 'POST', path: '/users' });
    expect(res.status).toBe(200);
    expect(res.body.method).toBe('POST');
  });

  it('GET /projects/unknown-id/endpoints returns 404', async () => {
    const res = await request(app).get('/projects/nonexistent-project-id/endpoints');
    expect(res.status).toBe(404);
  });

  it('DELETE /projects/:id/endpoints/:endpointId returns 204', async () => {
    const del = await request(app).delete(`/projects/${projectId}/endpoints/${endpointId}`);
    expect(del.status).toBe(204);
    const get = await request(app).get(`/projects/${projectId}/endpoints/${endpointId}`);
    expect(get.status).toBe(404);
  });
});
