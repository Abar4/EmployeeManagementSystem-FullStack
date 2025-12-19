import axios from 'axios';
import fs from 'fs';

const metricsData = fs.readFileSync('./metrics.txt', 'utf8'); // or generate dynamically
const GRAFANA_URL = 'https://prometheus-prod-43-prod-ap-south-1.grafana.net/api/prom/push';
const GRAFANA_API_KEY = process.env.GRAFANA_API_KEY;

if (!GRAFANA_API_KEY) {
  console.error('Error: GRAFANA_API_KEY not set');
  process.exit(1);
}

async function pushMetrics() {
  try {
    const response = await axios.post(GRAFANA_URL, metricsData, {
      headers: {
        'Authorization': `Bearer ${GRAFANA_API_KEY}`,
        'Content-Type': 'text/plain',
      },
    });
    console.log('Metrics pushed successfully:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Grafana API error:', error.response.status, error.response.data);
    } else {
      console.error('Request error:', error.message);
    }
    process.exit(1);
  }
}

pushMetrics();
