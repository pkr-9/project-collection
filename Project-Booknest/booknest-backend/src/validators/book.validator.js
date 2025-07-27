import { body } from "express-validator";
import { handleValidation } from "./shared.js";

export const validateBookCreation = [
  body("title").notEmpty().withMessage("Book title is required"),
  body("author").notEmpty().withMessage("Author name is required"),
  body("categoryId").notEmpty().withMessage("Category ID is required"),
  body("language").notEmpty().withMessage("Language is required"),
  body("edition").notEmpty().withMessage("Edition is required"),
  body("publicationDate")
    .notEmpty()
    .withMessage("Publication date is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be non-negative"),
  body("images")
    .isArray({ min: 1 })
    .withMessage("At least one image is required"),
  body("cityId").notEmpty().withMessage("City is required"),
  body("pincode").isNumeric().withMessage("Valid pincode is required"),
  handleValidation,
];

export const validateBookUpdate = [
  body("title").optional().isString(),
  body("author").optional().isString(),
  body("categoryId").optional().isString(),
  body("language").optional().isString(),
  body("edition").optional().isString(),
  body("publicationDate").optional().isString(),
  body("price").optional().isFloat({ min: 0 }),
  body("images").optional().isArray(),
  body("cityId").optional().isString(),
  body("pincode").optional().isNumeric(),
  handleValidation,
];
