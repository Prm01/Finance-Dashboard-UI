const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const transactionRoutes = require("./routes/transactionRoutes");
const copilotRoutes = require("./routes/copilotRoutes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const requestLogger = require("./middleware/requestLogger");

const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0";
const MONGODB_URI = process.env.MONGODB_URI;

const ALLOWED_PROD_ORIGINS = [
  process.env.FRONTEND_URL,
  process.env.ALLOWED_ORIGIN,
  process.env.RENDER_EXTERNAL_URL,
  "https://finance-dashboard-ui-1.onrender.com",
].filter(Boolean);

// Put your real laptop IPv4 here from `ipconfig`
const NETWORK_IP = "192.168.1.5";

const app = express();

/**
 * CORS Configuration for Development
 * Allows requests from common Vite development ports and network access
 */
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser tools (like Postman) or same-origin requests with no origin
    if (!origin) {
      return callback(null, true);
    }

    try {
      const url = new URL(origin);

      // Allow localhost on common Vite development ports (5173-5179)
      if (url.hostname === "localhost" && url.port) {
        const port = parseInt(url.port);
        if (port >= 5173 && port <= 5179) {
          return callback(null, true);
        }
      }

      // Allow 127.0.0.1 on common Vite development ports
      if (url.hostname === "127.0.0.1" && url.port) {
        const port = parseInt(url.port);
        if (port >= 5173 && port <= 5179) {
          return callback(null, true);
        }
      }

      // Allow local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x) on common Vite ports
      const isLocalNetworkIP = /^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(url.hostname);
      if (isLocalNetworkIP && url.port) {
        const port = parseInt(url.port);
        if (port >= 5173 && port <= 5179) {
          return callback(null, true);
        }
      }

      // Allow known production frontend origins
      if (ALLOWED_PROD_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      // Block other origins in development
      return callback(new Error(`CORS blocked for origin: ${origin}. Allowed: localhost/127.0.0.1/local network IPs on ports 5173-5179 and configured frontend origins`));
    } catch (error) {
      // Invalid URL format
      return callback(new Error(`Invalid origin format: ${origin}`));
    }
  },
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.type("text/plain; charset=utf-8").send("Backend is running 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Finance Dashboard API is running",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    localUrl: `http://localhost:${PORT}`,
    networkUrl: `http://${NETWORK_IP}:${PORT}`,
  });
});

app.use("/api/transactions", transactionRoutes);
app.use("/api/copilot", copilotRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDB(MONGODB_URI);

  const server = app.listen(PORT, HOST, () => {
    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  Finance Dashboard API");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`  Local:    http://localhost:${PORT}`);
    console.log(`  Network:  http://${NETWORK_IP}:${PORT}`);
    console.log(`  Root:     GET /`);
    console.log(`  Health:   GET /health`);
    console.log(`  API:      GET /api/transactions`);
    console.log(`  Copilot:  POST /api/copilot/polish`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
  });

  server.on("error", (err) => {
    console.error("HTTP server error:", err.message);
    process.exit(1);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});