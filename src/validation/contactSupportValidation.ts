import Joi from "joi";

export const createContactSupportValidation = Joi.object({
  fullName: Joi.string().optional(),
  mobileNumber: Joi.string().required(),
  preferredDate: Joi.string().optional(),
  preferredTime: Joi.string().optional(),
});
