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

router.get('/:projectId/endpoints', async (req, res, next) => {
  try {
    const project = await resolveProject(req, res);
    if (!project) return;

    const endpoints = await db.endpoint.findMany({
      where: { projectId: project.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(endpoints);
  } catch (err) {
    next(err);
  }
});

router.post('/:projectId/endpoints', async (req, res, next) => {
  try {
    const project = await resolveProject(req, res);
    if (!project) return;

    const { method, path } = req.body;
    const endpoint = await db.endpoint.create({
      data: { method, path, projectId: project.id },
    });
    res.status(201).json(endpoint);
  } catch (err) {
    next(err);
  }
});

router.get('/:projectId/endpoints/:id', async (req, res, next) => {
  try {
    const project = await resolveProject(req, res);
    if (!project) return;

    const endpoint = await db.endpoint.findFirst({
      where: { id: req.params.id, projectId: project.id },
    });
    if (!endpoint) return res.status(404).json({ error: 'not_found' });
    res.json(endpoint);
  } catch (err) {
    next(err);
  }
});

router.put('/:projectId/endpoints/:id', async (req, res, next) => {
  try {
    const project = await resolveProject(req, res);
    if (!project) return;

    const existing = await db.endpoint.findFirst({
      where: { id: req.params.id, projectId: project.id },
    });
    if (!existing) return res.status(404).json({ error: 'not_found' });

    const { method, path } = req.body;
    const endpoint = await db.endpoint.update({
      where: { id: req.params.id },
      data: { method, path },
    });
    res.json(endpoint);
  } catch (err) {
    next(err);
  }
});

router.delete('/:projectId/endpoints/:id', async (req, res, next) => {
  try {
    const project = await resolveProject(req, res);
    if (!project) return;

    const existing = await db.endpoint.findFirst({
      where: { id: req.params.id, projectId: project.id },
    });
    if (!existing) return res.status(404).json({ error: 'not_found' });

    await db.endpoint.delete({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
