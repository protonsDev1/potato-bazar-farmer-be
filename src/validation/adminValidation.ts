import Joi from "joi";

export const irrigationSourceSchema = Joi.object({
  name_en: Joi.string().required(),
  name_hi: Joi.string().required(),
  icon: Joi.string().optional(),
  position: Joi.number().optional(),
});

export const soilTypeSchema = Joi.object({
  name_en: Joi.string().required(),
  name_hi: Joi.string().required(),
  icon: Joi.string().optional(),
  position: Joi.number().optional(),
});
