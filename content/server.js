const https = require('https');
const fs = require('fs');
const express = require('express');
const promClient = require('prom-client');

const app = express();

// Configuration SSL
const sslOptions = {
	key: fs.readFileSync(process.env.SSL_KEY_PATH || '/app/certs/content.key'),
	cert: fs.readFileSync(process.env.SSL_CERT_PATH || '/app/certs/content.crt'),
	ca : fs.readFileSync(process.env.SSL_CA_PATH || '/app/certs/ca.crt')
};

// Création du registre pour stocker les metriques
const register = new promClient.Registry();

// Ajout des métriques par défaut au register (CPU, mémoire ...)
promClient.collectDefaultMetrics({ register });

// Endpoint /metrics pour Prometheus
app.get('/metrics', async (req, res) => {
	res.set('Content-Type', register.contentType);
	res.end(await register.metrics());
});

// Endpoint de health check (optionnel mais utilse)
app.get('/health', async (req, res) => {
	res.json({ status: 'ok', service: 'content'});
});

// Démarrer le serveur sur le port 9100
const PORT = process.env.METRICS_PORT || 9100;

// Création du serveur https
https.createServer(sslOptions, app).listen(PORT, () => {
	console.log(`Content metrics server (HTTPS) listening on port ${PORT}`);
});;
