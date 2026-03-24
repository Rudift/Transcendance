const express = require ('express');
const mongoose = require ('mongoose');
const app = express();
const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const reactionsRoutes = require('./routes/reactions');
const reportsRoutes = require('./routes/reports');
const path = require ('path');
const { promClient, register } = require('./metrics/registry');
require('dotenv').config();

app.use (express.json());

const httpsRequestsTotal = new promClient.Counter({
  name: 'https_requests_total',
  help: 'Total HTTPS requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

app.use((req, res, next) => {
  res.on('finish', () => {
    const routePart = req.route?.path;
    const route = routePart ? `${req.baseUrl || ''}${routePart}` : req.path;
    httpsRequestsTotal.inc({
      method: req.method,
      route,
      status_code: String(res.statusCode),
    });
  });
  next();
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect(process.env.DB_CONNECT)
  .then(() => console.log('Vous êtes bien connectés à MungoDB !'))
  .catch(() => console.log('Échec de la connexion à MungoDB'));

app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/reactions', reactionsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'bff' });
});

// Endpoint /metrics pour Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

module.exports = app;





