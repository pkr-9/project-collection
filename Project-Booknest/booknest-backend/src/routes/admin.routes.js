import express from "express";
import {
  createAdmin,
  listAllUsers,
  toggleBookPermission,
  deleteUserByAdmin,
} from "../controllers/adminController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/authController.js";

const router = express.Router();

router.post("/create", authenticate, isAdmin, createAdmin);
router.get("/users", authenticate, isAdmin, listAllUsers);
router.patch(
  "/books/:bookId/permission",
  authenticate,
  isAdmin,
  toggleBookPermission
);
router.delete("/users/:userId", authenticate, isAdmin, deleteUserByAdmin);

export const adminRoutes = router;
