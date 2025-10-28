import Joi from "joi";

export const createMandiAgentSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  state: Joi.string().required(),
  district: Joi.string().required(),
  city: Joi.string().required(),
  pinCode: Joi.string().required(),
  licenseNumber: Joi.string().optional().allow(null),
  remarks: Joi.string().optional().allow(null, ""),
  mandiIds: Joi.array().items(Joi.number()).required().min(1),
});

export const updateMandiAgentSchema = Joi.object({
  firstName: Joi.string().trim().optional().allow(null, ""),
  lastName: Joi.string().trim().optional().allow(null, ""),
  email: Joi.string().email().optional().allow(null, ""),
  mobile: Joi.string().optional().allow(null, ""),
  password: Joi.string().optional().allow(null, ""),
  confirmPassword: Joi.string().optional().allow(null, ""),
  state: Joi.string().optional().allow(null, ""),
  district: Joi.string().optional().allow(null, ""),
  city: Joi.string().optional().allow(null, ""),
  pinCode: Joi.string().optional().allow(null, ""),
  licenseNumber: Joi.string().optional().allow(null),
  remarks: Joi.string().optional().allow(null, ""),
  mandiIds: Joi.array().items(Joi.number()).optional(),
});
