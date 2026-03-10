import express from 'express';
import { traceDeckLogger } from '@tracedeck/sdk';

const INGEST_URL = process.env.TRACEDECK_INGEST_URL;
const PROJECT_ID = process.env.TRACEDECK_PROJECT_ID;
const PORT = process.env.PORT || 4000;

if (!INGEST_URL || !PROJECT_ID) {
  console.error('Error: TRACEDECK_INGEST_URL and TRACEDECK_PROJECT_ID must be set');
  process.exit(1);
}

const app = express();
app.use(express.json());

// Log every request to TraceDeck. logErrors: true so we can see ingest
// failures in dev without having to check the network tab.
app.use(traceDeckLogger({ ingestUrl: INGEST_URL, projectId: PROJECT_ID, logErrors: true }));

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

app.get('/api/users', async (req, res) => {
  await delay(randomInt(30, 120));
  res.json([
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Carol', email: 'carol@example.com' },
  ]);
});

app.post('/api/orders', async (req, res) => {
  await delay(randomInt(50, 200));
  // Simulate 10% validation failure rate
  if (Math.random() < 0.1) {
    return res.status(400).json({ error: 'invalid_payload', message: 'Missing required fields' });
  }
  res.status(201).json({ orderId: randomInt(1000, 9999), status: 'pending' });
});

app.get('/api/products/:id', async (req, res) => {
  await delay(randomInt(10, 60));
  // Simulate 30% missing product rate
  if (Math.random() < 0.3) {
    return res.status(404).json({ error: 'not_found', message: `Product ${req.params.id} does not exist` });
  }
  res.json({ id: req.params.id, name: 'Widget Pro', price: 9.99, stock: randomInt(0, 100) });
});

// Health check — logged by TraceDeck but that's fine for a dev service
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// --- Traffic generator ---
// Fires requests to itself so the DB populates autonomously without needing
// an external load generator. Uses recursive setTimeout (not setInterval) to
// avoid call stacking if a request takes longer than the interval.
const BASE_URL = `http://localhost:${PORT}`;

const routes = [
  () => fetch(`${BASE_URL}/api/users`),
  () =>
    fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: 'widget', qty: randomInt(1, 5) }),
    }),
  () => fetch(`${BASE_URL}/api/products/${randomInt(1, 20)}`),
];

function scheduleNextRequest() {
  // Randomize interval to produce more natural traffic patterns in charts
  const interval = randomInt(1500, 4000);
  setTimeout(async () => {
    const route = routes[randomInt(0, routes.length - 1)];
    try {
      await route();
    } catch {
      // Ignore — server may not be ready on the very first tick
    }
    scheduleNextRequest();
  }, interval);
}

app.listen(PORT, () => {
  console.log(`Sample service running on http://localhost:${PORT}`);
  console.log(`Logging to TraceDeck project: ${PROJECT_ID}`);
  console.log('Generating traffic automatically...');
  scheduleNextRequest();
});
