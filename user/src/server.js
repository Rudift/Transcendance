const https = require('https');
const fs = require('fs');

const apiApp = require('./api/app');
const metricsApp = require('./metrics/app');

const sslOptions = {
	key: fs.readFileSync(process.env.SSL_KEY_PATH || '/app/certs/user.key'),
	cert: fs.readFileSync(process.env.SSL_CERT_PATH || '/app/certs/user.crt'),
	ca: fs.readFileSync(process.env.SSL_CA_PATH || '/app/certs/ca.crt'),
};

const API_PORT = Number(process.env.PORT) || 7000;
const METRICS_PORT = Number(process.env.METRICS_PORT) || 9100;

https.createServer(sslOptions, apiApp).listen(API_PORT, () => {
	console.log(`User API (HTTPS) listening on ${API_PORT}`);
});

https.createServer(sslOptions, metricsApp).listen(METRICS_PORT, () => {
  console.log(`User Metrics (HTTPS) listening on ${METRICS_PORT}`);
});