import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import healthHandler from './api/health.js';
import busArrivalHandler from './api/bus-arrival.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  return healthHandler(req, res);
});

app.get('/api/bus-arrival', (req, res) => {
  return busArrivalHandler(req, res);
});

// Vite or Static assets mounting
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Urban Pulse Transit] Server listening on http://0.0.0.0:${PORT}`);
    console.log(`[Urban Pulse Transit] Health Monitor: http://0.0.0.0:${PORT}/api/health`);
    console.log(`[Urban Pulse Transit] LTA Bus Arrival: http://0.0.0.0:${PORT}/api/bus-arrival?BusStopCode=04121`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
