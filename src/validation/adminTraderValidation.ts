import Joi from "joi";

export const cropTradedCreateSchema = Joi.object({
  name: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const cropTradedUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const traderInterestCreateSchema = Joi.object({
  name: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const traderInterestUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const traderTypeCreateSchema = Joi.object({
  name: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const traderTypeUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const traderVarietyCreateSchema = Joi.object({
  name: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const traderVarietyUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const marketCoverageCreateSchema = Joi.object({
  name: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});

export const marketCoverageUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  position: Joi.number().optional(),
});
