const express = require('express');
const app = express();
const promClient = require('prom-client');

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
	res.json({ status: 'ok', service: 'auth'});
});

// Endpoint pour créer une alerte mémoire
let memoryHog = [];

app.get('/stress-memory', (req, res) => {
	// Alloue sur le tas V8 (heap JS) au lieu des Buffers externes
	// new Array(N).fill(X) est bien tracké par process.memoryUsage().rss
	memoryHog.push(new Array(20_000_000).fill(Math.random()));

	res.json({ allocated: `~${memoryHog.length * 160} MB` });
});

app.get('/free-memory', (req, res) => {
	memoryHog = [];
	res.json({ status: 'memory released' });
});

module.exports = app;