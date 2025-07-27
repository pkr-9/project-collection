import express from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooksByKeyword,
  getBooksByUser,
  getDonatedBooks,
  getTopDonors,
  getBooksByCategory,
  getPendingPermissionBooks,
} from "../controllers/bookController.js";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  validateBookCreation,
  validateBookUpdate,
} from "../validators/book.validator.js";

const router = express.Router();

// Public routes
router.get("/", getAllBooks);
router.get("/search", searchBooksByKeyword);
router.get("/donations", getDonatedBooks);
router.get("/top-donors", getTopDonors);
router.get("/user/:userId", getBooksByUser);
router.get("/category/:categoryId", getBooksByCategory);
router.get(
  "/pending",
  authenticate,
  authorizeRoles("admin"),
  getPendingPermissionBooks
);
router.get("/:id", getBookById);

// Protected routes
router.post("/", authenticate, validateBookCreation, createBook);
router.put("/:id", authenticate, validateBookUpdate, updateBook);
router.delete("/:id", authenticate, deleteBook);

export const bookRoutes = router;
