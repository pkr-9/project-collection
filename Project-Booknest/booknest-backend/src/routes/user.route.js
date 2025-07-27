import express from "express";
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  validateUserCreation,
  validateUserUpdate,
} from "../validators/user.validator.js";

const router = express.Router();
// Public route to create a user
router.post("/", validateUserCreation, createUser);
// Protected routes for user management
router.get("/:id", authenticate, getUserById);
router.put("/:id", authenticate, validateUserUpdate, updateUser);
router.delete("/:id", authenticate, deleteUser);

// Export the router for use in the main app
export const userRoutes = router;
