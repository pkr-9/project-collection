import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
} from "../controllers/cartController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getCart);
router.post("/", authenticate, addToCart);
router.delete("/:bookId", authenticate, removeFromCart);

export const cartRoutes = router;
