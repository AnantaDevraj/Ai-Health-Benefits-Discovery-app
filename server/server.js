/**
 * AI Benefits Discovery - Express Server
 * Provides REST endpoints and a pluggable AI adapter.
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// CORS: allow local client by default
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: clientOrigin }));

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
import classifyRouter from './src/routes/classify.js';
import benefitsRouter from './src/routes/benefits.js';
import planRouter from './src/routes/plan.js';

app.use('/api/classify', classifyRouter);
app.use('/api/benefits', benefitsRouter);
app.use('/api/plan', planRouter);

// Production: serve client build if present
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuild = path.join(__dirname, '../client/dist');

app.use(express.static(clientBuild));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

let basePort = Number(process.env.PORT || 5000);
const maxTries = 10;

function tryListen(attempt = 0) {
  const port = basePort + attempt;
  const server = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && attempt < maxTries) {
      console.warn(`Port ${port} in use, trying ${port + 1}...`);
      setTimeout(() => tryListen(attempt + 1), 200);
    } else {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  });
}

tryListen();


