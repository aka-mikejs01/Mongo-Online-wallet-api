import { checkSchema, validationResult } from "express-validator";

const walletSchema = {
  senderId: {
    notEmpty: true,
    isMongoId: true,
  },
  recieverId: {
    notEmpty: true,
    isMongoId: true,
  },
  amount: {
    notEmpty: true,
    isInt: true,
  },
};

export const walletValidator = [
  checkSchema(walletSchema),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ error: error.array() });

    next();
  },
];
