const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();

const PORT = Number(process.env.PORT || 7000);

const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH || "/app/certs/status.key"),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH || "/app/certs/status.crt"),
  ca: fs.readFileSync(process.env.SSL_CA_PATH || "/app/certs/ca.crt"),
};

const targets = [
    { name: "auth", url: "https://auth:7000/health" },
    { name: "user", url: "https://user:7000/health" },
    { name: "content", url: "https://content:7000/health" },
    { name: "social", url: "https://social:7000/health" },
    { name: "realtime", url: "https://realtime:7000/health" },
    { name: "notification", url: "https://notification:7000/health" },
];

const TIMEOUT_MS = Number(process.env.STATUS_TIMEOUT_MS || 1500);

const caPath = process.env.SSL_CA_PATH || "/app/certs/ca.crt";
const ca = fs.existsSync(caPath) ? fs.readFileSync(caPath) : undefined;

function probe(urlString, { rejectUnauthorized }) {
  return new Promise((resolve) => {
    const url = new URL(urlString);
    const start = Date.now();

    const req = https.request(
      {
        hostname: url.hostname,
        port: url.port ? Number(url.port) : 443,   // <-- pas 8443
        path: url.pathname + url.search,
        method: "GET",
        timeout: TIMEOUT_MS,
        ca,
        rejectUnauthorized,
      },
      (res) => {
        res.resume();
        res.on("end", () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            code: res.statusCode,
            ms: Date.now() - start,
          });
        });
      }
    );

    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", (err) =>
      resolve({ ok: false, error: err.message, ms: Date.now() - start })
    );

    req.end();
  });
}

async function probeWithFallback(url) {
  const strict = await probe(url, { rejectUnauthorized: true });
  if (strict.ok) return { ...strict, tls: "verify" };

  // si erreur TLS fréquente en dev, on retente en insecure
  const insecure = await probe(url, { rejectUnauthorized: false });
  return { ...insecure, tls: "insecure" };
}

app.get("/status", async (_req, res) => {
  const checkedAt = new Date().toISOString();
  const results = await Promise.all(
    targets.map(async (t) => ({
      name: t.name,
      url: t.url,
      ...(await probeWithFallback(t.url)),
    }))
  );

  const overallOk = results.every((r) => r.ok);
  res.status(overallOk ? 200 : 503);
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  const rows = results
    .map((r) => {
      const status = r.ok ? "UP" : "DOWN";
      const code = r.code ?? "-";
      const err = (r.error ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<tr>
        <td>${r.name}</td>
        <td>${status}</td>
        <td>${code}</td>
        <td>${r.tls}</td>
        <td>${r.ms}ms</td>
        <td><small>${err}</small></td>
      </tr>`;
    })
    .join("");

  res.end(`<!doctype html>
<html>
<head><meta charset="utf-8"><title>Status</title></head>
<body>
  <h1>Status</h1>
  <p>Checked at: ${checkedAt}</p>
  <table border="1" cellpadding="6" cellspacing="0">
    <thead><tr><th>Service</th><th>Status</th><th>HTTP</th><th>TLS</th><th>Latency</th><th>Error</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`);
});

const server = https.createServer(sslOptions, app);

server.on("error", (err) => {
  console.error("HTTPS server error:", err);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`status service (HTTPS) listening on ${PORT}`);
});