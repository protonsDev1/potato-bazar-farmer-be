import Joi from "joi";
import { TRANSPORT_SERVICE_STATUS } from "../database/models/transportRequirement";

export const createTransportServiceSchema = Joi.object({
  transporterType: Joi.string().optional().allow(null, ""),
  vehicleTypeRequired: Joi.array().items(Joi.string()).optional(),
  noOfVehicles: Joi.number().optional().allow(null, ""),
  routeCoverage: Joi.array().items(Joi.string()).optional(),
  rateType: Joi.array().items(Joi.string()).optional(),
  additionalRequired: Joi.array().items(Joi.string()).optional(),
  documents: Joi.array().items(Joi.string()).optional(),
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

export const updateTransportServiceSchema = Joi.object({
  transporterType: Joi.string().optional().allow(null, ""),
  vehicleTypeRequired: Joi.array().items(Joi.string()).optional(),
  noOfVehicles: Joi.number().optional().allow(null, ""),
  routeCoverage: Joi.array().items(Joi.string()).optional(),
  rateType: Joi.array().items(Joi.string()).optional(),
  additionalRequired: Joi.array().items(Joi.string()).optional(),
  documents: Joi.array().items(Joi.string()).optional(),
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
  id: Joi.number().min(1).required(),
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

export const availabilitySchema = Joi.object({
  isAvailable: Joi.boolean().required(),
});
