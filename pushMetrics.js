import axios from 'axios';
import client from 'prom-client';

// Create a Registry to collect metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Get metrics as a string
const metricsData = await register.metrics();

const GRAFANA_URL = 'https://prometheus-prod-43-prod-ap-south-1.grafana.net/api/prom/push';
const GRAFANA_API_KEY = process.env.GRAFANA_API_KEY?.trim();

if (!GRAFANA_API_KEY) {
  console.error('Error: GRAFANA_API_KEY not set!');
  process.exit(1);
}

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
