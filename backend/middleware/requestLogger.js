/**
 * Logs each request when the response finishes (method, path, status, duration).
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    const ts = new Date().toISOString();
    console.log(`[${ts}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
  });
  next();
};

module.exports = requestLogger;
