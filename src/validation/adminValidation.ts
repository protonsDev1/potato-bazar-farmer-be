import Joi from "joi";

export const irrigationSourceSchema = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().optional(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const soilTypeSchema = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().optional(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const potatoVarietySchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const potatoSubVarietySchema = Joi.object({
  name: Joi.string().required(),
  varietyId: Joi.number().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const sowingMethodSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const farmEquipmentUsedSchema = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().optional(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const technologyUsedSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const priceDiscoverySchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const biggestChallengeInSellingSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const storageTypeSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const usageTypeSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const operationalChallengeSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});
