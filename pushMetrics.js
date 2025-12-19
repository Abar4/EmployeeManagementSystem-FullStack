// pushMetrics.js
import client from 'prom-client';
import axios from 'axios';

// Use GitHub secrets for sensitive info
const GRAFANA_URL = process.env.GRAFANA_URL; 
const API_KEY = process.env.GRAFANA_API_KEY;

// Collect default Node.js metrics
client.collectDefaultMetrics();

async function pushMetrics() {
  try {
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
