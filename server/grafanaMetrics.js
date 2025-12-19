import client from "prom-client";
import axios from "axios";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const pageLoadCounter = new client.Counter({
  name: "frontend_page_load_total",
  help: "Total frontend page loads",
});

register.registerMetric(pageLoadCounter);

export function recordPageLoad() {
  pageLoadCounter.inc();
}

export async function pushMetrics() {
  const metrics = await register.metrics();

  await axios.post(
    process.env.GRAFANA_PROM_URL,
    metrics,
    {
      auth: {
        username: process.env.GRAFANA_USERNAME,
        password: process.env.GRAFANA_API_KEY,
      },
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );

  console.log("✅ Metrics pushed to Grafana Cloud");
}
