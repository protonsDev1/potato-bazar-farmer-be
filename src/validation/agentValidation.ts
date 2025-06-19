import Joi from "joi";

export const updateAgentSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  mobile: Joi.string().optional(),

  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  district: Joi.string().optional(),
  note: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});
