import { body } from "express-validator";
import { handleValidation } from "./shared.js";

export const validateUserCreation = [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("role").optional().isIn(["customer", "seller", "admin"]),
  body("contact").notEmpty(),
  body("profileImage").notEmpty(),
  handleValidation,
];

export const validateUserUpdate = [
  body("name").optional().isString(),
  body("email").optional().isEmail(),
  body("password").optional().isLength({ min: 6 }),
  body("role").optional().isIn(["customer", "seller", "admin"]),
  body("contact").optional().isString(),
  body("profileImage").optional().isString(),
  body("address").optional().isObject(),
  handleValidation,
];
