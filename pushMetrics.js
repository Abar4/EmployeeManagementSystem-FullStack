// pushMetrics.js
import axios from 'axios';
import fs from 'fs';

const GRAFANA_URL = 'https://prometheus-prod-43-prod-ap-south-1.grafana.net/api/prom/push';
const API_KEY = process.env.GRAFANA_API_KEY;

const metrics = fs.readFileSync('./metrics.txt', 'utf-8');

try {
  const res = await axios.post(GRAFANA_URL, metrics, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'text/plain'
    }
  });
  console.log('Metrics pushed successfully!');
} catch (err) {
  console.error('Grafana API error:', err.response?.data || err.message);
}
