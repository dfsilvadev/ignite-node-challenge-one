import express from "express";

/**
 * Import configurations
 * Port, Node Environment, and Database URL
 */
import config from "./utils/config/config";
const PORT = config.port || 3000;

const app = express();

/**
 * Config Response
 * JSON
 */
app.use(express.json());

/**
 * Routes
 */
app.get("/", (_req, res) => {
  res.send("🔥 API started");
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🔥 Server started at http://localhost:${PORT}`);
});
