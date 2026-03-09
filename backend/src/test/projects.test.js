import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import db from '../lib/db.js';
import { seedTestUser, cleanTestUser, buildTestApp } from './helpers.js';

let app;
let testUser;
let otherUser;

beforeAll(async () => {
  testUser = await seedTestUser('projects');
  otherUser = await db.user.create({
    data: { cognitoId: 'other-cognito-projects', email: 'other-projects@example.com' },
  });
  app = buildTestApp(testUser);
});

afterAll(async () => {
  await cleanTestUser(testUser.id);
  await cleanTestUser(otherUser.id);
});

describe('Projects CRUD', () => {
  let projectId;

  it('POST /projects creates a project and returns 201', async () => {
    const res = await request(app)
      .post('/projects')
      .send({ name: 'Test Project', description: 'Integration test project' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test Project');
    expect(res.body.id).toBeDefined();
    projectId = res.body.id;
  });

  it('GET /projects returns an array containing the created project', async () => {
    const res = await request(app).get('/projects');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((p) => p.id === projectId)).toBe(true);
  });

  it('GET /projects/:id returns the correct project', async () => {
    const res = await request(app).get(`/projects/${projectId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(projectId);
    expect(res.body.name).toBe('Test Project');
  });

  it('PUT /projects/:id updates the project name', async () => {
    const res = await request(app)
      .put(`/projects/${projectId}`)
      .send({ name: 'Updated Name' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  it('GET /projects/:id returns 404 for a project owned by a different user', async () => {
    // Create a project under otherUser and try to access it as testUser
    const otherProject = await db.project.create({
      data: { userId: otherUser.id, name: 'Other Project' },
    });
    const res = await request(app).get(`/projects/${otherProject.id}`);
    expect(res.status).toBe(404);
    await db.project.delete({ where: { id: otherProject.id } });
  });

  it('DELETE /projects/:id returns 204 and the project is gone', async () => {
    const del = await request(app).delete(`/projects/${projectId}`);
    expect(del.status).toBe(204);
    const get = await request(app).get(`/projects/${projectId}`);
    expect(get.status).toBe(404);
  });
});
