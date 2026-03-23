const express = require('express');
const { promClient, register } = require('../metrics/registry.js');

const app = express();
app.use(express.json());

const httpsRequestsTotal = new promClient.Counter({
	name: 'https_requests_total',
	help : 'Total HTTPS requests',
	labelNames: ['method', 'route', 'status_code'],
	registers: [register],
});

app.use((req, res, next) => {
	res.on('finish', () => {
		const route = req.route?.path ?? req.path;
		httpsRequestsTotal.inc({
			method: req.method,
			route,
			status_code: String(res.statusCode),
		});
	});
	next();
});

app.get('/health', (req, res) => {
	res.json({ ok: true });
});

module.exports = app;