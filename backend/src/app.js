import express from 'express';
import cors from 'cors';
import ingestRouter from './routes/ingest.js';
import projectsRouter from './routes/projects.js';
import endpointsRouter from './routes/endpoints.js';
import analyticsRouter from './routes/analytics.js';
import auth from './middleware/auth.js';

export function createApp(authMiddleware = auth) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/ingest', ingestRouter);
  app.use('/projects', authMiddleware, projectsRouter);
  app.use('/projects', authMiddleware, endpointsRouter);
  app.use('/projects', authMiddleware, analyticsRouter);
  app.get('/me', authMiddleware, (req, res) => res.json(req.user));

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  });

  return app;
}
