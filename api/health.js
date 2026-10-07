/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Health check monitor endpoint for Urban Pulse Transit APIs
 * Route: GET /api/health
 */
export default async function healthHandler(req, res) {
  const startTime = Date.now();
  const ltaKeyConfigured = Boolean(
    process.env.LTA_ACCOUNT_KEY &&
    process.env.LTA_ACCOUNT_KEY !== 'YOUR_LTA_DATAMALL_KEY' &&
    process.env.LTA_ACCOUNT_KEY.trim() !== ''
  );

  const memory = process.memoryUsage();

  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    services: {
      apiGateway: {
        status: 'online',
        latencyMs: Date.now() - startTime,
      },
      ltaDataMall: {
        status: ltaKeyConfigured ? 'configured' : 'needs_key',
        endpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
        hasAccountKey: ltaKeyConfigured,
        refreshIntervalSeconds: 20,
        busArrivalApiRoute: '/api/bus-arrival',
      },
    },
    system: {
      heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024 * 100) / 100,
      rssMb: Math.round(memory.rss / 1024 / 1024 * 100) / 100,
    },
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(200).json(healthData);
}
