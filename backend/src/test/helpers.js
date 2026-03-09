import db from '../lib/db.js';
import { createApp } from '../app.js';

export async function seedTestUser(tag = 'default') {
  // Each test file passes a unique tag so concurrent runs don't share the same user
  return db.user.create({
    data: { cognitoId: `test-cognito-${tag}`, email: `test-${tag}@example.com` },
  });
}

export async function cleanTestUser(userId) {
  // Delete in reverse FK order — migrations lack ON DELETE CASCADE at the DB level
  const projects = await db.project.findMany({ where: { userId }, select: { id: true } });
  const projectIds = projects.map((p) => p.id);

  if (projectIds.length > 0) {
    const endpoints = await db.endpoint.findMany({
      where: { projectId: { in: projectIds } },
      select: { id: true },
    });
    const endpointIds = endpoints.map((e) => e.id);

    if (endpointIds.length > 0) {
      await db.requestLog.deleteMany({ where: { endpointId: { in: endpointIds } } });
    }
    await db.endpoint.deleteMany({ where: { projectId: { in: projectIds } } });
  }

  await db.project.deleteMany({ where: { userId } });
  await db.user.delete({ where: { id: userId } });
}

export function buildTestApp(testUser) {
  const mockAuth = (req, res, next) => { req.user = testUser; next(); };
  return createApp(mockAuth);
}
