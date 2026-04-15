import Joi from "joi";
import { MODULES } from "../database/models/modulePricing";

export const createModulePricingSchema = Joi.object({
  module: Joi.string()
    .valid(...Object.values(MODULES))
    .required(),

  pricePerContact: Joi.number().positive().required(),
});

export const updateModulePricingSchema = Joi.object({
  module: Joi.string()
    .valid(...Object.values(MODULES))
    .optional(),

  pricePerContact: Joi.number().positive().required(),
  isActive: Joi.boolean().optional(),
});

export const idParamSchema = Joi.object({
  id: Joi.number().integer().required(),
});

export const unlockContactSchema = Joi.object({
  modulePricingId: Joi.number().required(),
  recordId: Joi.number().required(),
});
