const https = require('https');  // ← Changé de http à https
const fs = require('fs');         // ← Ajouté pour lire les certificats
const express = require('express');
const promClient = require('prom-client');
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return false;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '7000');

// ═══════════════════════════════════════════════════════
// NOUVEAU : Configuration SSL
// ═══════════════════════════════════════════════════════
const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH || '/app/certs/bff.key'),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH || '/app/certs/bff.crt'),
  ca: fs.readFileSync(process.env.SSL_CA_PATH || '/app/certs/ca.crt')
};
// ═══════════════════════════════════════════════════════

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// ═══════════════════════════════════════════════════════
// MODIFIÉ : Utiliser https.createServer au lieu de http.createServer
// ═══════════════════════════════════════════════════════
const server = https.createServer(options, app);  // ← Changé
// ═══════════════════════════════════════════════════════

server.on('error', errorHandler);

server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind + ' (HTTPS)');  // ← Ajouté "(HTTPS)" pour clarté
});

server.listen(port);

// ═══════════════════════════════════════════════════════
// NOUVEAU : Serveur de métriques Prometheus sur le port 9100
// ═══════════════════════════════════════════════════════
const metricsApp = express();
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

metricsApp.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

metricsApp.get('/health', async (req, res) => {
  res.json({ status: 'ok', service: 'bff' });
});

const metricsPort = process.env.METRICS_PORT || 9100;
const metricsServer = https.createServer(options, metricsApp);

metricsServer.listen(metricsPort, () => {
  console.log(`BFF metrics server (HTTPS) listening on port ${metricsPort}`);
});
// ═══════════════════════════════════════════════════════