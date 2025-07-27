import express from "express";
import {
  sendOTP,
  verifyOTP,
  registerWithOTP,
  updatePasswordWithOTP,
} from "../controllers/otpController.js";
import {
  validateSendOTP,
  validateVerifyOTP,
  validateRegisterWithOTP,
  validateUpdatePasswordWithOTP,
} from "../validators/otp.validator.js";
import { otpLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/send", otpLimiter, validateSendOTP, sendOTP);
router.post("/verify", validateVerifyOTP, verifyOTP);
router.post("/register", validateRegisterWithOTP, registerWithOTP);
router.post(
  "/reset-password",
  validateUpdatePasswordWithOTP,
  updatePasswordWithOTP
);

export default router;
