import Joi from "joi";
import { TRANSPORT_SERVICE_STATUS } from "../database/models/transportRequirement";

export const createTransportRequirementSchema = Joi.object({
  pickLocationOrCity: Joi.string().optional().allow(null, ""),
  pickDistrict: Joi.string().optional().allow(null, ""),
  pickState: Joi.string().optional().allow(null, ""),
  dropLocationOrCity: Joi.string().optional().allow(null, ""),
  dropDistrict: Joi.string().optional().allow(null, ""),
  dropState: Joi.string().optional().allow(null, ""),
  quantityUnit: Joi.string().optional().allow(null, ""),
  quantity: Joi.number().integer().optional().allow(null),
  packaging: Joi.string().optional().allow(null, ""),
  vehicleTypeRequired: Joi.array().items(Joi.string()).optional(),
  preferredPickUpDate: Joi.string().optional().allow(null, ""),
  rateType: Joi.string().optional().allow(null, ""),
  rateExpectation: Joi.string().optional().allow(null, ""),
  additionalRequired: Joi.array().items(Joi.string()).optional(),
  ownerOrCompanyName: Joi.string().optional().allow(null, ""),
  phoneNumber: Joi.string()
    .optional()
    .pattern(/^[6-9]\d{9}$/)
    .allow(null, ""),
  whatsappNumber: Joi.string()
    .optional()
    .pattern(/^[6-9]\d{9}$/)
    .allow(null, ""),
  alternatePhoneNumber: Joi.string()
    .optional()
    .pattern(/^[6-9]\d{9}$/)
    .allow(null, ""),
});

export const updateTransportRequirementSchema = Joi.object({
  pickLocationOrCity: Joi.string().optional().allow(null, ""),
  pickDistrict: Joi.string().optional().allow(null, ""),
  pickState: Joi.string().optional().allow(null, ""),
  dropLocationOrCity: Joi.string().optional().allow(null, ""),
  dropDistrict: Joi.string().optional().allow(null, ""),
  dropState: Joi.string().optional().allow(null, ""),
  quantityUnit: Joi.string().optional().allow(null, ""),
  quantity: Joi.number().integer().optional().allow(null),
  packaging: Joi.string().optional().allow(null, ""),
  vehicleTypeRequired: Joi.array().items(Joi.string()).optional(),
  preferredPickUpDate: Joi.string().optional().allow(null, ""),
  rateType: Joi.string().optional().allow(null, ""),
  rateExpectation: Joi.string().optional().allow(null, ""),
  additionalRequired: Joi.array().items(Joi.string()).optional(),
  ownerOrCompanyName: Joi.string().optional().allow(null, ""),
  phoneNumber: Joi.string()
    .optional()
    .pattern(/^[6-9]\d{9}$/)
    .allow(null, ""),
  whatsappNumber: Joi.string()
    .optional()
    .pattern(/^[6-9]\d{9}$/)
    .allow(null, ""),
  alternatePhoneNumber: Joi.string()
    .optional()
    .pattern(/^[6-9]\d{9}$/)
    .allow(null, ""),
  isActive: Joi.boolean().optional().allow(null),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(TRANSPORT_SERVICE_STATUS))
    .required(),
  reason: Joi.when("status", {
    is: TRANSPORT_SERVICE_STATUS.REJECTED,
    then: Joi.string().required().messages({
      "any.required": "reason is required when rejecting transport service",
    }),
    otherwise: Joi.string().optional().allow(null, ""),
  }),
});
