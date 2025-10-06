import Joi from "joi";

export const createAdvertisementRequestValidation = Joi.object({
  serviceIds: Joi.array().items(Joi.number()).required().min(1),
  serviceDuration: Joi.string().required(),
  description: Joi.string().optional(),
});
