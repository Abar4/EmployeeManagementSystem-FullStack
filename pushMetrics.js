import { pushMetrics } from "./server/grafanaMetrics.js";

try {
  await pushMetrics();
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
