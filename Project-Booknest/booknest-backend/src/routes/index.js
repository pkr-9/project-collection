// A barrel file (usually index.js) gathers exports from multiple files in the same directory and re-exports them — allowing you to import everything at once from that directory.

import express from "express";
import { adminRoutes } from "./admin.routes.js";
import { bookRoutes } from "./book.routes.js";
import { userRoutes } from "./user.route.js";
import { authRoutes } from "./auth.routes.js";
import { locationRoutes } from "./location.routes.js";
import { categoryRoutes } from "./category.routes.js";
import { cartRoutes } from "./cart.routes.js";
import { orderRoutes } from "./order.routes.js";

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/books", bookRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/location", locationRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);

// Test Route
router.get("/", (req, res) => {
  res.send("This is BookNest API");
});

// Export the router for use in the main app
export default router;
