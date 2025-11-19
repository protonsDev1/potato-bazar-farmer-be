import Joi from "joi";

export const createPromotionRequestValidation = Joi.object({
  companyName: Joi.string().required(),
  contactPerson: Joi.string().required(),
  mobile: Joi.string().required(),
  email: Joi.string().allow(null, "").optional(),
  requirement: Joi.string().allow(null, "").optional(),
});
