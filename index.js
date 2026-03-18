const express = require("express");
const client = require("prom-client");

const app = express();

// Create a Registry
const register = new client.Registry();

// Default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Custom metric
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
});

register.registerMetric(httpRequestCounter);

// Middleware
app.use((req, res, next) => {
  httpRequestCounter.inc();
  next();
});

// Your app route
app.get("/", (req, res) => {
  res.send("Hello DevOps 🚀");
});

// Metrics endpoint (IMPORTANT 🔥)
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});