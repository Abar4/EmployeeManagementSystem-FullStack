const express = require('express');
const { recordPageLoad, pushMetrics, register } = require('./grafanaMetrics');

const app = express();
app.use(express.json());

// simple CORS for dev
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Prometheus scrape endpoint
app.get('/metrics', async (_req, res) => {
  try {
    res.setHeader('Content-Type', register.contentType || 'text/plain');
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err.message || String(err));
  }
});

// Frontend calls this to record a page load
app.post('/events/page_load', (_req, res) => {
  try {
    recordPageLoad();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

// Optionally push metrics to Grafana Cloud periodically
if (process.env.GRAFANA_PROM_URL) {
  const interval = Number(process.env.PUSH_INTERVAL_SEC || 30) * 1000;
  setInterval(() => pushMetrics().catch(() => {}), interval);
}

const PORT = process.env.METRICS_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Metrics server listening on http://localhost:${PORT}`);
});
