import { body } from "express-validator";
import { handleValidation, checkNestedBodyFields } from "./shared.js";

export const validateOrder = [
  checkNestedBodyFields([
    "shippingAddress.street",
    "shippingAddress.city",
    "shippingAddress.state",
    "shippingAddress.zip",
  ]),
  body("userId").notEmpty(),
  body("cartId").notEmpty(),
  body("totalAmount").isFloat({ min: 0 }),
  body("contactPerson").notEmpty(),
  body("contactNumber").notEmpty(),
  body("orderItem").isArray({ min: 1 }),
  handleValidation,
];
