import Joi from "joi";

export const createPromotionRequestValidation = Joi.object({
  companyName: Joi.string().required(),
  contactPerson: Joi.string().required(),
  mobile: Joi.string().required(),
  email: Joi.string().optional(),
  requirement: Joi.string().optional(),
});
