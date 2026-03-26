const https = require('https');
const fs = require('fs');

const apiApp = require('./service/app');
const metricsApp = require('./metrics/app');

const sslOptions = {
	key: fs.readFileSync(process.env.SSL_KEY_PATH || '/app/certs/notification.key'),
	cert: fs.readFileSync(process.env.SSL_CERT_PATH || '/app/certs/notification.crt'),
	ca: fs.readFileSync(process.env.SSL_CA_PATH || '/app/certs/ca.crt'),
};

const API_PORT = Number(process.env.PORT) || 7000;
const METRICS_PORT = Number(process.env.METRICS_PORT) || 9100;

https.createServer(sslOptions, apiApp).listen(API_PORT, () => {
	console.log(`Notification API (HTTPS) listening on ${API_PORT}`);
});

https.createServer(sslOptions, metricsApp).listen(METRICS_PORT, () => {
  console.log(`Notification Metrics (HTTPS) listening on ${METRICS_PORT}`);
});