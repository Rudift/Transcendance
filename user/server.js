const https = require('https');
const fs = require('fs');
const app = require('./app');

// Configuration SSL
const sslOptions = {
	key: fs.readFileSync(process.env.SSL_KEY_PATH || '/app/certs/user.key'),
	cert: fs.readFileSync(process.env.SSL_CERT_PATH || '/app/certs/user.crt'),
	ca : fs.readFileSync(process.env.SSL_CA_PATH || '/app/certs/ca.crt')
};

// Démarrer le serveur sur le port 9100
const PORT = process.env.METRICS_PORT || 9100;

// Création du serveur https
https.createServer(sslOptions, app).listen(PORT, () => {
	console.log(`User metrics server (HTTPS) listening on port ${PORT}`);
});;