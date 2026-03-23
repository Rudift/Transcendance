const express = require('express');

require('../metrics/registry.js');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
	res.json({ ok: true });
});

module.exports = app;