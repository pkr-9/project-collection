import express from "express";
import {
  createOrder,
  getOrdersByUser,
  getAllOrders,
} from "../controllers/orderController.js";
import { authenticate } from "../validators/order.validator.js";
import { isAdmin } from "../middlewares/authController.js";

const router = express.Router();

router.post("/", authenticate, createOrder);
router.get("/my", authenticate, getOrdersByUser);
router.get("/", authenticate, isAdmin, getAllOrders);

export const orderRoutes = router;
