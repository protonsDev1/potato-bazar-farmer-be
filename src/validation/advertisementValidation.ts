import Joi from "joi";

export const createAdvertisementRequestValidation = Joi.object({
  serviceIds: Joi.array().items(Joi.number()).required().min(1),
  serviceDuration: Joi.string().required(),
  description: Joi.string().optional(),
});

export const createAdvertisementServiceSchema = Joi.object({
  name: Joi.string().required(),
  subName: Joi.string().optional(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});
