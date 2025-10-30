import Joi from "joi";

export const userRegistrationSchema = Joi.object({
  otp: Joi.string().required(),
  fullName: Joi.string().required(),
  mobile: Joi.string().required(),
  state: Joi.string().optional().allow(null, ""),
  district: Joi.string().optional().allow(null, ""),
  villageOrCity: Joi.string().optional().allow(null, ""),
});
