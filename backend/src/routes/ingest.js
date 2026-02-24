import { Router } from 'express';
import { ingestQueue } from '../queue.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    await ingestQueue.add('log', req.body);
    res.sendStatus(202);
  } catch (err) {
    next(err);
  }
});

export default router;
