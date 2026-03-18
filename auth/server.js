const https = require('https');
const app = require('./app');
const fs = require('fs');

// Configuration SSL
const sslOptions = {
	key: fs.readFileSync(process.env.SSL_KEY_PATH || '/app/certs/auth.key'),
	cert: fs.readFileSync(process.env.SSL_CERT_PATH || '/app/certs/auth.crt'),
	ca : fs.readFileSync(process.env.SSL_CA_PATH || '/app/certs/ca.crt')
};

// Démarrer le serveur sur le port 9100
const PORT = process.env.METRICS_PORT || 9100;

// Création du serveur https
https.createServer(sslOptions, app).listen(PORT, () => {
	console.log(`Auth metrics server (HTTPS) listening on port ${PORT}`);
});;
