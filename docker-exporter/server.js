// Import
const https = require('https');
const fs = require('fs');
const express = require('express');
const Docker = require('dockerode');
const promClient = require('prom-client');
const { nextTick } = require('process');

// Initialisation
const app = express();
const docker = new Docker({ socketPath: '/var/run/docker.sock'});
const register =  new promClient.Registry();

// Création des métriques
const networkRxBytes = new promClient.Gauge({
    name: 'docker_container_network_rx_bytes',
    help: 'Bytes received by container',
    labelNames: ['container_name', 'container_id']
});

const networkTxBytes = new promClient.Gauge({
    name: 'docker_container_network_tx_bytes',
    help: 'Bytes transmitted by container',
    labelNames: ['container_name', 'container_id']
});

// Enregistrement des métriques
register.registerMetric(networkRxBytes);
register.registerMetric(networkTxBytes);


// Récupérer les stats Docker
async function collectDockerStats(){
    const containers = await docker.listContainers();

    for (const containerInfo of containers) {
        try {
            const container = docker.getContainer(containerInfo.Id);
            const stats = await container.stats({ stream : false });
            const networks = stats.networks || {};
            let totalRx = 0;
            let totalTx = 0;

            for (const iface in networks) {
                totalRx += networks[iface].rx_bytes || 0;
                totalTx += networks[iface].tx_bytes || 0;
            }

            const containerName = containerInfo.Names[0].replace('/', '');

            networkRxBytes.set(
                { container_name: containerName, container_id : containerInfo.Id.substring(0, 12)},
                totalRx
            );

            networkTxBytes.set(
                { container_name: containerName, container_id : containerInfo.Id.substring(0, 12)},
                totalTx
            );
        } catch (err) {
            console.warn(`Could not get stats for container ${containerInfo.Id}:`, err.message);
            continue;
        }
    }
}

// Création de l'endpoint pour les métriques
app.get('/metrics', async (req, res) => {
    try {
        await collectDockerStats();
        res.set('Content-type', register.contentType);
        res.end(await register.metrics());
    } catch (error) {
        console.error('Error collecting metrics:', error);
        res.status(500).send('Error collecting metrics');
    }

});

// Démarrer le serveur
const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    ca: fs.readFileSync(process.env.SSL_CA_PATH)
}

https.createServer(sslOptions, app).listen(9200, () => {
  console.log(`Docker exporter (HTTPS) listening on port 9200`);
});


