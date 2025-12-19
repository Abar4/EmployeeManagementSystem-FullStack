const client = require("prom-client");
const axios = require("axios");

/* --------------------
   PROMETHEUS METRICS
-------------------- */

const register = new client.Registry();

// collect default system metrics (cpu, memory, etc.)
client.collectDefaultMetrics({ register });

// custom metric example
const pageLoadCounter = new client.Counter({
  name: "frontend_page_load_total",
  help: "Total number of frontend page loads",
});

register.registerMetric(pageLoadCounter);

/* --------------------
   METRIC UPDATE LOGIC
-------------------- */

// call this whenever page loads or event occurs
function recordPageLoad() {
  pageLoadCounter.inc();
}

/* --------------------
   PUSH TO GRAFANA CLOUD
-------------------- */

async function pushMetrics() {
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

/* --------------------
   EXPORTS
-------------------- */

module.exports = {
  recordPageLoad,
  pushMetrics,
  register,
};
