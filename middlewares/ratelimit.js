const setRateLimit = require("express-rate-limit");

// Rate limit middleware
const rateLimitMiddleware = setRateLimit({
  windowMs: 1 * 1000,
  max: 2,
  message: "You have exceeded your 1 request per second limit.",
  headers: true,
});

module.exports = rateLimitMiddleware;
