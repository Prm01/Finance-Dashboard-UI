const dotenv = require("dotenv");
dotenv.config(); // Render uses dashboard env vars

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

const app = express();

/* =========================================================
   SIMPLE & SAFE CORS (Works on Render + Local)
========================================================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://finance-dashboard-ui-1.onrender.com", // your frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("CORS Blocked:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ========================================================= */

app.use(express.json());
app.use(requestLogger);

/* =========================================================
   Routes
========================================================= */

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Finance Dashboard API is running",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/transactions", transactionRoutes);
app.use("/api/copilot", copilotRoutes);

/* =========================================================
   Error Handling
========================================================= */

app.use(notFound);
app.use(errorHandler);

/* =========================================================
   Start Server
========================================================= */

const start = async () => {
  try {
    await connectDB(MONGODB_URI);

    const server = app.listen(PORT, HOST, () => {
      console.log("==============================");
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log("==============================");
    });

    server.on("error", (err) => {
      console.error("HTTP server error:", err.message);
      process.exit(1);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

start(); 