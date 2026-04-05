const mongoose = require("mongoose");

mongoose.connection.on("disconnected", () => {
  console.warn("[MongoDB] Disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("[MongoDB] Connection error:", err.message);
});

const connectDB = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing — add it to backend/.env");
  }

  await mongoose.connect(mongoUri);
  console.log("[MongoDB] Connected successfully");
};

module.exports = connectDB;

