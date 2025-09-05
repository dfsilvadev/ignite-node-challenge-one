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
import router from "./app/routes/router";
app.use(router);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🔥 Server started at http://localhost:${PORT}`);
});
