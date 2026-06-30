const errorHandler = (error, _req, res, _next) => {
  console.error(error);
  const status = error.name === "ValidationError" || error.code === 11000 || error.name === "MulterError" ? 400 : 500;
  const message = error.code === 11000
    ? `A product with this ${Object.keys(error.keyPattern || {})[0] || "value"} already exists`
    : error.message || "Server error";
  res.status(status).json({ success: false, message });
};

module.exports = errorHandler;
