// Utiliser le même protocole et host que le navigateur
// Cela fonctionne automatiquement en HTTP ou HTTPS
const basePath = `${window.location.protocol}//${window.location.host}/api`;

export default basePath;