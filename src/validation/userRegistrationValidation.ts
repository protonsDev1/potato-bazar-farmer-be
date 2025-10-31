import Joi from "joi";

export const userRegistrationSchema = Joi.object({
  otp: Joi.string().required().length(6),
  fullName: Joi.string().required().max(255),
  mobile: Joi.string()
    .required()
    .pattern(/^[6-9]\d{9}$/),
  state: Joi.string().optional().allow(null, "").max(255),
  district: Joi.string().optional().allow(null, "").max(255),
  villageOrCity: Joi.string().optional().allow(null, "").max(255),
});
