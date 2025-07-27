import express from "express";
import {
  createCategory,
  getAllCategories,
} from "../controllers/categoryController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/authController.js";

const router = express.Router();

router.post("/", authenticate, isAdmin, createCategory);
router.get("/", getAllCategories);

export const categoryRoutes = router;
