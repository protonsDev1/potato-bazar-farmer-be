import Joi from "joi";

// Define the Joi schema for user signup validation
export const userSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Name should be a type of string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should have a maximum of 100 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of string",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).max(20).required().messages({
    "string.base": "Password should be a type of string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password should have at least 6 characters",
    "string.max": "Password should have a maximum of 20 characters",
    "any.required": "Password is required",
  }),

  role: Joi.string()
    .valid("agent", "admin", "user") // optional but can have predefined values
    .optional()
    .messages({
      "string.base": "Role should be a type of string",
      "any.only": "Role must be one of [agent, admin, user]",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const createAgentSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  district: Joi.string().optional(),
  note: Joi.string().optional(),
});

export const agentLoginSchema = Joi.object({
  agentId: Joi.string().required(),
  password: Joi.string().required(),
});

export const otpSendSchema = Joi.object({
  mobile: Joi.string().required(),
});

export const otpVerifySchema = Joi.object({
  mobile: Joi.string().required().pattern(/^[6-9]\d{9}$/),
  otp: Joi.string().required().length(4),
});