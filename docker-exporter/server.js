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
        const container = docker.getContainer(containerInfo.Id);
        const stats = await container.stats({ stream : false });
        const networks = stats.networks || {};
        let totalRx = 0;
        let totalTx = 0;

        for (const iface in networks) {
            totalRx += networks[iface].rx_bytes || 0;
            totalTx += networks[iface].tx_bytes || 0;
        }

        // Mise à jour des métriques dans Prometheus
        const containerName = containerInfo.Names[0].replace('/', '');

        networkRxBytes.set(
            { container_name: containerName, container_id : containerInfo.Id.substring(0, 12)},
            totalRx
        );

        networkTxBytes.set(
            { container_name: containerName, container_id : containerInfo.Id.substring(0, 12)},
            totalTx
        );

    }
}

// Création de l'endpoint pour les métriques
app.get('metrics', async (req, res) => {
    try {
        await collectDockerStats();
        res.set('Content-type', register.contentType);
        res.end(await register.metrics());
    } catch (error) {
        console.error('Error collecting metrics:', error);
        res.status(500).send('Error collecting metrics');
    }

});

const PORT = 9200;
app.listen(PORT, () => {
    console.log(`Docker exporter listening on port ${PORT}`);
    console.log(`Metrics available at http://localhost:${PORT}/metrics`);
})
