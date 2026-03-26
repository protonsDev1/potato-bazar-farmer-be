import Joi from "joi";

// Create Plan
export const createDirectoryPlanSchema = Joi.object({
  name: Joi.string().trim().required(),

  price: Joi.number().positive().required(),

  durationInMonths: Joi.number().integer().min(1).required(),
});

// Update Plan
export const updateDirectoryPlanSchema = Joi.object({
  name: Joi.string().trim().optional(),

  price: Joi.number().positive().optional(),

  durationInMonths: Joi.number().integer().min(1).optional(),

  isActive: Joi.boolean().optional(),
});

// Params
export const idParamSchema = Joi.object({
  id: Joi.number().integer().required(),
});

export const planIdParamSchema = Joi.object({
  planId: Joi.number().integer().required(),
});
