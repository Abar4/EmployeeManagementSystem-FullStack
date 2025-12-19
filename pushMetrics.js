// pushMetrics.js
import client from 'prom-client';
import axios from 'axios';

// Use GitHub secrets for sensitive info (read from environment)
const GRAFANA_URL = process.env.GRAFANA_PROM_URL || process.env.GRAFANA_URL;
const GRAFANA_USERNAME = process.env.GRAFANA_USERNAME || process.env.GRAFANA_USER;
const GRAFANA_API_KEY = process.env.GRAFANA_API_KEY || process.env.GRAFANA_KEY;

// Collect default Node.js metrics
client.collectDefaultMetrics();

async function pushMetrics() {
  try {
    if (!GRAFANA_URL) {
      console.log('GRAFANA_PROM_URL not set — skipping pushMetrics.');
      return;
    }

    // validate URL and avoid pushing to localhost in CI
    try {
      const parsed = new URL(GRAFANA_URL);
      const host = parsed.hostname;
      if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
        console.warn(`GRAFANA_PROM_URL points to local host (${host}) — skipping pushMetrics.`);
        return;
      }
    } catch (e) {
      console.warn('Invalid GRAFANA_PROM_URL, skipping pushMetrics:', e.message);
      return;
    }

    const metrics = await client.register.metrics();

    const axiosOpts = {
      headers: { 'Content-Type': 'text/plain' },
    };

    if (GRAFANA_USERNAME && GRAFANA_API_KEY) {
      axiosOpts.auth = { username: GRAFANA_USERNAME, password: GRAFANA_API_KEY };
    } else if (GRAFANA_API_KEY) {
      // fallback to Bearer if only API key provided
      axiosOpts.headers.Authorization = `Bearer ${GRAFANA_API_KEY}`;
    } else {
      console.warn('No Grafana credentials provided; attempting unauthenticated push.');
    }

    const res = await axios.post(GRAFANA_URL, metrics, axiosOpts);

    console.log('Metrics pushed successfully!');
    console.log(res.data);
  } catch (err) {
    console.error('Grafana API error (non-fatal):', err.response?.data || err.message);
    // Do not exit with non-zero — allow CI to continue when Grafana is unreachable
  }
}

pushMetrics();
