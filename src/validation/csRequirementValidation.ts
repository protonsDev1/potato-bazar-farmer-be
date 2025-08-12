import Joi from "joi";

export const createColdStorageRequirementSchema = Joi.object({
  location: Joi.string().trim().allow(null, "").optional(),
  district: Joi.string().trim().allow(null, "").optional(),
  state: Joi.string().trim().allow(null, "").optional(),
  verified: Joi.boolean().default(false),
  quantity: Joi.string().trim().allow(null, "").optional(),
  capacityMin: Joi.number().integer().min(0).allow(null).optional(),
  capacityMax: Joi.number()
    .integer()
    .min(Joi.ref("capacityMin"))
    .allow(null)
    .optional()
    .messages({
      "number.min": "capacityMax must be greater than or equal to capacityMin",
    }),
  duration: Joi.string().trim().allow(null, "").optional(),
  requiredFromDate: Joi.date().allow(null).optional(),
  preferredLocation: Joi.boolean().default(false),
  specialcoldStorageRequirements: Joi.string()
    .trim()
    .allow(null, "")
    .optional(),
  contactNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Contact number must be a valid 10-digit number",
      "any.required": "Contact number is required",
    }),
  email: Joi.string().email().allow(null, "").optional(),
  isActive: Joi.boolean().default(true),
  storageType: Joi.string().trim().allow(null, "").optional(),
});
