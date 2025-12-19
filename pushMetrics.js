// pushMetrics.js
import client from 'prom-client';
import axios from 'axios';

// Grafana / Prometheus Pushgateway settings
const GRAFANA_URL = 'https://<YOUR_INSTANCE>.grafana.net/api/prom/push';
const API_KEY = process.env.GRAFANA_API_KEY; // store as GitHub secret

// Collect default Node.js metrics
client.collectDefaultMetrics();

// Push metrics to Grafana
async function pushMetrics() {
  try {
    // Get metrics as a string in Prometheus format
    const metrics = await client.register.metrics();

    const res = await axios.post(GRAFANA_URL, metrics, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'text/plain',
      },
    });

    console.log('Metrics pushed successfully!');
    console.log(res.data);
  } catch (err) {
    console.error('Grafana API error:', err.response?.data || err.message);
    process.exit(1);
  }
}

pushMetrics();
