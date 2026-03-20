const express = require('express');
const { register } = require('./registry');

const app = express();

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Uniquement pour debug
// app.get('/health', (req, res) => {
//     res.json({ status: 'ok', service: 'auth-metrics' });
// });

module.exports = app;