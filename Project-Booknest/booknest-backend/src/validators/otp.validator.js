import { body, validationResult } from "express-validator";

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateSendOTP = [
  body("email").isEmail().withMessage("Valid email is required."),
  handleValidation,
];

export const validateVerifyOTP = [
  body("email").isEmail().withMessage("Valid email is required."),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("Valid 6-digit OTP is required."),
  handleValidation,
];

export const validateRegisterWithOTP = [
  body("name").notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Valid email is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits."),
  handleValidation,
];

export const validateUpdatePasswordWithOTP = [
  body("email").isEmail().withMessage("Valid email is required."),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits."),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters."),
  handleValidation,
];
