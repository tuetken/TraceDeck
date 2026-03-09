import { Router } from 'express';
import db from '../lib/db.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const projects = await db.project.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await db.project.create({
      data: { name, description, userId: req.user.id },
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const project = await db.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!project) return res.status(404).json({ error: 'not_found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const existing = await db.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) return res.status(404).json({ error: 'not_found' });

    const { name, description } = req.body;
    const project = await db.project.update({
      where: { id: req.params.id },
      data: { name, description },
    });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await db.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) return res.status(404).json({ error: 'not_found' });

    await db.project.delete({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
