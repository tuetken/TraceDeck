import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import ingestRouter from './routes/ingest.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/ingest', ingestRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'internal_error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
