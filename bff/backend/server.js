const https = require('https');  // ← Changé de http à https
const fs = require('fs');         // ← Ajouté pour lire les certificats
const express = require('express');

const serviceApp = require('./app');
const metricsApp = require('./metrics/app');

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

const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH || '/app/certs/bff.key'),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH || '/app/certs/bff.crt'),
  ca: fs.readFileSync(process.env.SSL_CA_PATH || '/app/certs/ca.crt')
};

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

const METRICS_PORT = Number(process.env.METRICS_PORT) || 9100;

const server = https.createServer(sslOptions, serviceApp);  // ← Changé

https.createServer(sslOptions, metricsApp).listen(METRICS_PORT, () => {
  console.log(`BFF Metrics (HTTPS) listening on ${METRICS_PORT}`);
});

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind + ' (HTTPS)');
});

 
server.listen(port);
