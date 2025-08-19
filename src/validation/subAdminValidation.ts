import Joi from "joi";

export const createSubAdminSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
  privileges: Joi.array()
    .items(
      Joi.string().valid(
        "user_management",
        "mandi_agents",
        "kyc_requests",
        "buy_requests",
        "sell_requests",
        "cold_storage",
        "content_management",
        "help_support",
        "reports"
      )
    )
    .default([]),
});

export const updateSubAdminSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(50).optional(),
  isActive: Joi.boolean().optional(),
  privileges: Joi.array()
    .items(
      Joi.string().valid(
        "user_management",
        "mandi_agents",
        "kyc_requests",
        "buy_requests",
        "sell_requests",
        "cold_storage",
        "content_management",
        "help_support",
        "reports"
      )
    )
    .optional(),
});
