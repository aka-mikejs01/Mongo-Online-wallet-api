import { checkSchema, validationResult } from "express-validator";

const registerSchema = {
  name: {
    in: ["body"],
    trim: true,
    notEmpty: {
      errorMessage: "Name is required",
    },
    isLength: {
      options: { min: 3, max: 10 },
    },
  },
  email: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Please enter valid email",
    },
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Password is required",
    },
    isLength: {
      options: { min: 6, max: 20 },
      errorMessage: "Password must be at least 6 characters",
    },
  },
  balance: {
    in: ["body"],
    isInt: true,
    notEmpty: {
      errorMessage: "Please enter you balance",
    },
  },
};

const loginSchema = {
  email: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Please enter valid email",
    },
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
};

export const registerValidator = [
  checkSchema(registerSchema),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ error: error.array() });

    next();
  },
];

export const loginValidator = [
  checkSchema(loginSchema),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ error: error.array() });

    next();
  },
];
