import Joi from "joi";

export const irrigationSourceSchema = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().optional(),
  position: Joi.number().optional(),
});

export const soilTypeSchema = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().optional(),
  position: Joi.number().optional(),
});

export const potatoVarietySchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
});

export const potatoSubVarietySchema = Joi.object({
  name: Joi.string().required(),
  varietyId: Joi.number().required(),
  position: Joi.number().optional(),
});

export const sowingMethodSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
});

export const farmEquipmentUsedSchema = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().optional(),
  position: Joi.number().optional(),
});

export const technologyUsedSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
});

export const priceDiscoverySchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
});

export const biggestChallengeInSellingSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
});
