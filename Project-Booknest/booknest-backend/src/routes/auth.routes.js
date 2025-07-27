import express from "express";
import { login, register } from "../controllers/authController.js";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/validationMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);

router.get(
  "/profile",
  authenticate,
  authorizeRoles("customer", "seller", "admin"),
  (req, res) => {
    res.json({
      message: "This is your profile",
      user: req.user,
    });
  }
);

export const authRoutes = router;
