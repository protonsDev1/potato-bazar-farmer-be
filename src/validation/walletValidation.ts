import Joi from "joi";

/**
 * ================================
 * ADMIN CREDIT / DEBIT VALIDATION
 * ================================
 */
export const adminWalletSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be positive",
    "any.required": "User ID is required",
  }),

  amount: Joi.number().positive().precision(2).required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be greater than 0",
    "any.required": "Amount is required",
  }),

  description: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Description must be a string",
    "any.required": "Description is required",
  }),
});

/**
 * ==================================
 * OPTIONAL: ADMIN SEARCH WALLET
 * (if later you add filters)
 * ==================================
 */
export const adminWalletSearchSchema = Joi.object({
  userId: Joi.number().integer().positive(),

  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(100).default(10),
});
