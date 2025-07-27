import { validationResult } from "express-validator";

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const checkBodyFields = (fields) => (req, res, next) => {
  const missing = fields.filter((field) => !(field in req.body));
  if (missing.length > 0) {
    return res
      .status(400)
      .json({ message: `Missing fields: ${missing.join(", ")}` });
  }
  next();
};

export const checkNestedBodyFields = (nestedFields) => (req, res, next) => {
  const missing = nestedFields.filter((path) => {
    return (
      path
        .split(".")
        .reduce(
          (obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined),
          req.body
        ) === undefined
    );
  });
  if (missing.length > 0) {
    return res
      .status(400)
      .json({ message: `Missing nested fields: ${missing.join(", ")}` });
  }
  next();
};

export const handleValidationParams = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), location: "params" });
  }
  next();
};

export const handleValidationQuery = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), location: "query" });
  }
  next();
};
