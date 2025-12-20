import express from "express";
import client from "prom-client";

const app = express();
const register = new client.Registry();

client.collectDefaultMetrics({ register });

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(3001, () => {
  console.log("Metrics server running on port 3001");
});
