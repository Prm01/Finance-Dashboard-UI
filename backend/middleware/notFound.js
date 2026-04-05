/**
 * Catches unmatched routes. Must be registered after all route handlers.
 */
const notFound = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

module.exports = notFound;
