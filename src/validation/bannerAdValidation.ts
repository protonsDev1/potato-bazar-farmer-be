import Joi from "joi";

export const createBannerPlanSchema = Joi.object({
  name: Joi.string().trim().required(),
  price: Joi.number().positive().required(),
  durationInDays: Joi.number().integer().min(1).required(),
});

export const updateBannerPlanSchema = Joi.object({
  name: Joi.string().trim().optional(),
  price: Joi.number().positive().optional(),
  durationInDays: Joi.number().integer().min(1).optional(),
  isActive: Joi.boolean().optional(),
});

export const idParamSchema = Joi.object({
  id: Joi.number().integer().required(),
});

export const planIdParamSchema = Joi.object({
  planId: Joi.number().integer().required(),
});
