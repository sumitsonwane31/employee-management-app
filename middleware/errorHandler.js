// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;

  // Mongoose validation error details
  let message = err.message || "Server Error";
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map(e => e.message);
    message = `Validation failed: ${details.join(", ")}`;
  }

  return res.status(status).json({
    success: false,
    error: message
  });
};
