import rateLimit from "express-rate-limit";

// ============================================
// RATE LIMITERS
// ============================================

/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for admin users
    return req.user && req.user.role === "admin";
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per 15 minutes
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Create snippet rate limiter
 * 30 snippets per hour
 */
export const createSnippetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  message: "Too many snippets created, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise use IP
    return req.user ? req.user._id : req.ip;
  },
});

/**
 * Comment rate limiter
 * 50 comments per hour
 */
export const commentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  message: "Too many comments, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user._id : req.ip;
  },
});

/**
 * Like rate limiter
 * 100 likes per hour
 */
export const likeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: "Too many likes, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user._id : req.ip;
  },
});

/**
 * Search rate limiter
 * 60 searches per minute
 */
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: "Too many search requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user._id : req.ip;
  },
});

/**
 * Custom rate limiter factory
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} max - Maximum requests per window
 * @param {string} message - Error message
 * @returns {Function} Rate limiter middleware
 */
export const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.user ? req.user._id : req.ip;
    },
  });
};

/**
 * Rate limit info middleware
 * Adds rate limit info to response headers
 */
export const rateLimitInfo = (req, res, next) => {
  res.set({
    "X-RateLimit-Limit": req.rateLimit?.limit || "N/A",
    "X-RateLimit-Remaining": req.rateLimit?.current || "N/A",
    "X-RateLimit-Reset": req.rateLimit?.resetTime || "N/A",
  });
  next();
};
