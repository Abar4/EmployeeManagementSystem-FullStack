const axios = require('axios');
const fs = require('fs');

const GRAFANA_URL = 'https://prometheus-prod-43-prod-ap-south-1.grafana.net/api/prom/push';
const API_KEY = process.env.GRAFANA_API_KEY; // store in GitHub Secrets

const metrics = fs.readFileSync('./metrics.txt', 'utf-8');

axios.post(GRAFANA_URL, metrics, {
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'text/plain'
  }
})
.then(res => console.log('Metrics pushed successfully!'))
.catch(err => console.error('Grafana API error:', err.response?.data || err.message));
