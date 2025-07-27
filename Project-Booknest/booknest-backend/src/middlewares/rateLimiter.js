import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: "Too many OTP requests from this IP. Please try again later.",
});

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: "Too many login attempts. Please try again later.",
});
