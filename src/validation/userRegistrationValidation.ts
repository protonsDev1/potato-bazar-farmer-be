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

export const matchAppVersionSchema = Joi.object({
  deviceType: Joi.string()
    .valid("android", "ios")
    .required()
    .messages({
      "any.required": "deviceType is required",
      "any.only": "deviceType must be android or ios",
    }),

  version: Joi.string()
    .trim()
    .max(10)
    .required()
    .messages({
      "any.required": "version is required",
      "string.base": "version must be a string",
    }),

  versionCode: Joi.number()
    .positive()
    .required()
    .messages({
      "any.required": "versionCode is required",
      "number.base": "versionCode must be a number",
      "number.integer": "versionCode must be an integer",
    }),
    isForceUpdateEnabled: Joi.boolean().optional().messages({
      "any.required": "isForceUpdateEnabled is required",
      "boolean.base": "isForceUpdateEnabled must be a boolean",
    }),
})
