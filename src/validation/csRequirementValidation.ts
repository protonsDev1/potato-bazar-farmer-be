import Joi from "joi";
import { CS_REQUIREMENT_STATUS } from "../database/models/coldStorageRequirement";

export const createColdStorageRequirementSchema = Joi.object({
  location: Joi.string().trim().allow(null, "").optional(),
  district: Joi.string().trim().allow(null, "").optional(),
  state: Joi.string().trim().allow(null, "").optional(),
  verified: Joi.boolean().default(false),
  quantity: Joi.string().trim().required(),
  unit: Joi.string().trim().allow(null, "").optional(),
  commodityType: Joi.string().trim().required(),
  storageTypes: Joi.array().items(Joi.string()).allow(null).optional(),
  bagTypes: Joi.array().items(Joi.string()).allow(null).optional(),
  duration: Joi.string().trim().required(),
  requiredFromDate: Joi.date().required(),
  preferredLocation: Joi.boolean().default(false),
  specialcoldStorageRequirements: Joi.string()
    .trim()
    .allow(null, "")
    .optional(),
  isActive: Joi.boolean().default(true),
});

export const updateColdStorageRequirementSchema = Joi.object({
  location: Joi.string().trim().allow(null, "").optional(),
  district: Joi.string().trim().allow(null, "").optional(),
  state: Joi.string().trim().allow(null, "").optional(),
  verified: Joi.boolean().optional(),
  quantity: Joi.string().trim().allow(null, "").optional(),
  unit: Joi.string().trim().allow(null, "").optional(),
  commodityType: Joi.string().trim().allow(null, "").optional(),
  storageTypes: Joi.array().items(Joi.string()).allow(null).optional(),
  bagTypes: Joi.array().items(Joi.string()).allow(null).optional(),
  duration: Joi.string().trim().allow(null, "").optional(),
  requiredFromDate: Joi.date().allow(null).optional(),
  preferredLocation: Joi.boolean().optional(),
  specialcoldStorageRequirements: Joi.string()
    .trim()
    .allow(null, "")
    .optional(),
  isActive: Joi.boolean().optional(),
});

export const updateCSRequirementStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(CS_REQUIREMENT_STATUS))
    .required(),
  reason: Joi.when("status", {
    is: CS_REQUIREMENT_STATUS.REJECTED,
    then: Joi.string().required().messages({
      "any.required": "reason is required when rejecting buy request",
    }),
    otherwise: Joi.string().optional().allow(null, ""),
  }),
});
