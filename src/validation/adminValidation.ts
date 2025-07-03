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

export const brandPreferenceReasonCreateSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const seedBrandCreateSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const sellingChannelCreateSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const sellingPlaceCreateSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const sellingPriceCreateSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const brandPreferenceReasonUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const seedBrandUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const sellingChannelUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const sellingPlaceUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const sellingPriceUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const irrigationMethodCreateSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const irrigationMethodUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const potatoTypeCreateSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const potatoTypeUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});
