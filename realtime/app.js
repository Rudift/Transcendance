const express = require('express');
const promClient = require('prom-client');
const app = express();

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
    res.json({ status: 'ok', service: 'realtime'});
});

module.exports = app;