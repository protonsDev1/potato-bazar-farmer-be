import Joi from "joi";

export const cropTradedCreateSchema = Joi.object({
  cropName: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const cropTradedUpdateSchema = Joi.object({
  cropName: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const traderInterestCreateSchema = Joi.object({
  interest: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const traderInterestUpdateSchema = Joi.object({
  interest: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const traderTypeCreateSchema = Joi.object({
  type: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const traderTypeUpdateSchema = Joi.object({
  type: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const traderVarietyCreateSchema = Joi.object({
  variety: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const traderVarietyUpdateSchema = Joi.object({
  variety: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});
