const mongoose = require("mongoose");

/**
 * Central error handler. Must be registered last and have 4 arguments.
 * eslint-disable-next-line no-unused-vars
 */
const errorHandler = (err, req, res, next) => {
  console.error("[Error]", err.message || err);

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages[0] || "Validation failed",
      errors: messages,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate key — this record already exists",
    });
  }

  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
