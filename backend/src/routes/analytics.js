import { Router } from 'express';
import db from '../lib/db.js';

const router = Router({ mergeParams: true });

// Verify the project exists and belongs to the requesting user.
async function resolveProject(req, res) {
  const project = await db.project.findFirst({
    where: { id: req.params.projectId, userId: req.user.id },
  });
  if (!project) res.status(404).json({ error: 'not_found' });
  return project;
}

// Build a createdAt filter from optional ?from and ?to query params.
function timeFilter(query) {
  if (!query.from && !query.to) return {};
  const createdAt = {};
  if (query.from) createdAt.gte = new Date(query.from);
  if (query.to) createdAt.lte = new Date(query.to);
  return { createdAt };
}

router.get('/:projectId/analytics/summary', async (req, res, next) => {
  try {
    const project = await resolveProject(req, res);
    if (!project) return;

    const where = { endpoint: { projectId: project.id }, ...timeFilter(req.query) };

    const [timeStats, statusGroups] = await Promise.all([
      db.requestLog.aggregate({
        where,
        _count: { id: true },
        _avg: { responseTimeMs: true },
        _min: { responseTimeMs: true },
        _max: { responseTimeMs: true },
      }),
      db.requestLog.groupBy({
        by: ['statusCode'],
        where,
        _count: { id: true },
        orderBy: { statusCode: 'asc' },
      }),
    ]);

    res.json({
      totalRequests: timeStats._count.id,
      responseTime: {
        avgMs: Math.round(timeStats._avg.responseTimeMs ?? 0),
        minMs: timeStats._min.responseTimeMs ?? 0,
        maxMs: timeStats._max.responseTimeMs ?? 0,
      },
      statusCodes: statusGroups.map((g) => ({
        statusCode: g.statusCode,
        count: g._count.id,
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:projectId/analytics/endpoints', async (req, res, next) => {
  try {
    const project = await resolveProject(req, res);
    if (!project) return;

    const where = { endpoint: { projectId: project.id }, ...timeFilter(req.query) };

    const logGroups = await db.requestLog.groupBy({
      by: ['endpointId'],
      where,
      _count: { id: true },
      _avg: { responseTimeMs: true },
      orderBy: { _count: { id: 'desc' } },
    });

    if (logGroups.length === 0) return res.json([]);

    const endpointIds = logGroups.map((g) => g.endpointId);
    const endpoints = await db.endpoint.findMany({
      where: { id: { in: endpointIds } },
      select: { id: true, method: true, path: true },
    });
    const endpointMap = Object.fromEntries(endpoints.map((e) => [e.id, e]));

    res.json(
      logGroups.map((g) => ({
        endpointId: g.endpointId,
        method: endpointMap[g.endpointId]?.method,
        path: endpointMap[g.endpointId]?.path,
        requestCount: g._count.id,
        avgResponseTimeMs: Math.round(g._avg.responseTimeMs ?? 0),
      }))
    );
  } catch (err) {
    next(err);
  }
});

export default router;
