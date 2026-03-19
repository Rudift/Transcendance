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

module.exports = app;