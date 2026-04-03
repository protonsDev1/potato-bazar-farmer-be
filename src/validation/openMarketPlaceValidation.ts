import Joi from "joi";
import {
  OPEN_MARKET_CATEGORY,
  OPEN_MARKET_STATUS,
} from "../database/models/openMarketPlace";

export const createOpenMarketSchema = Joi.object({
  category: Joi.string()
    .valid(...Object.values(OPEN_MARKET_CATEGORY))
    .required(),
  machineryCategory: Joi.string().optional().allow(null, ""),
  equipmentType: Joi.string().optional().allow(null, ""),
  brandName: Joi.string().optional().allow(null, ""),
  modelName: Joi.string().optional().allow(null, ""),
  condition: Joi.string().optional().allow(null, ""),
  yearOfPurchase: Joi.string().optional().allow(null, ""),
  expectedPrice: Joi.string().optional().allow(null, ""),
  serviceCategory: Joi.string().optional().allow(null, ""),
  serviceCoverageArea: Joi.string().optional().allow(null, ""),
  serviceUnit: Joi.string().optional().allow(null, ""),
  serviceChargesPerUnit: Joi.number().optional().allow(null),
  packaging: Joi.string().optional().allow(null, ""),
  materialType: Joi.string().optional().allow(null, ""),
  bagSize: Joi.string().optional().allow(null, ""),
  packagingUnit: Joi.string().optional().allow(null, ""),
  packagingUnitRate: Joi.number().optional().allow(null, ""),
  delivery: Joi.string().optional().allow(null, ""),
  typeOfFarming: Joi.string().optional().allow(null, ""),
  potatoVariety: Joi.array().items(Joi.string()).optional(),
  contractType: Joi.string().optional().allow(null, ""),
  contractUnit: Joi.string().optional().allow(null, ""),
  contractUnitRate: Joi.number().optional().allow(null, ""),
  fromMonth: Joi.string().optional().allow(null, ""),
  toMonth: Joi.string().optional().allow(null, ""),
  paymentTerms: Joi.string().optional().allow(null, ""),
  contractFarmingRegion: Joi.string().optional().allow(null, ""),
  areaUnit: Joi.string().optional().allow(null, ""),
  totalArea: Joi.number().optional().allow(null, ""),
  landOrLeaseContractType: Joi.string().optional().allow(null, ""),
  numberOfYears: Joi.number().integer().optional().allow(null, ""),
  numberOfMonths: Joi.number().integer().optional().allow(null, ""),
  irrigationAvailability: Joi.boolean().optional().allow(null, ""),
  soilType: Joi.string().optional().allow(null, ""),
  description: Joi.string().optional().allow(null, ""),
  state: Joi.string().optional().allow(null, ""),
  district: Joi.string().optional().allow(null, ""),
  locationOrCity: Joi.string().optional().allow(null, ""),
  pinCodeOrDigiPin: Joi.string().optional().allow(null, ""),
  nameOrCompanyName: Joi.string().optional().allow(null, ""),
  email: Joi.string().email().optional().allow(null, ""),
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
  attachments: Joi.array().items(Joi.string()).optional(),
  expectedHarvestPeriod: Joi.date().optional().allow(null),
  approxAcreRequirement: Joi.string().optional().allow(null, ""),
  pricePreference: Joi.string().optional().allow(null, ""),
  listingType: Joi.string().optional().allow(null, ""),
});

export const updateOpenMarketSchema = Joi.object({
  category: Joi.string()
    .valid(...Object.values(OPEN_MARKET_CATEGORY))
    .optional()
    .allow(null, ""),
  machineryCategory: Joi.string().optional().allow(null, ""),
  equipmentType: Joi.string().optional().allow(null, ""),
  brandName: Joi.string().optional().allow(null, ""),
  modelName: Joi.string().optional().allow(null, ""),
  condition: Joi.string().optional().allow(null, ""),
  yearOfPurchase: Joi.string().optional().allow(null, ""),
  expectedPrice: Joi.string().optional().allow(null, ""),
  serviceCategory: Joi.string().optional().allow(null, ""),
  serviceCoverageArea: Joi.string().optional().allow(null, ""),
  serviceUnit: Joi.string().optional().allow(null, ""),
  serviceChargesPerUnit: Joi.number().optional().allow(null),
  packaging: Joi.string().optional().allow(null, ""),
  materialType: Joi.string().optional().allow(null, ""),
  bagSize: Joi.string().optional().allow(null, ""),
  packagingUnit: Joi.string().optional().allow(null, ""),
  packagingUnitRate: Joi.number().optional().allow(null, ""),
  delivery: Joi.string().optional().allow(null, ""),
  typeOfFarming: Joi.string().optional().allow(null, ""),
  potatoVariety: Joi.array().items(Joi.string()).optional(),
  contractType: Joi.string().optional().allow(null, ""),
  contractUnit: Joi.string().optional().allow(null, ""),
  contractUnitRate: Joi.number().optional().allow(null, ""),
  fromMonth: Joi.string().optional().allow(null, ""),
  toMonth: Joi.string().optional().allow(null, ""),
  paymentTerms: Joi.string().optional().allow(null, ""),
  contractFarmingRegion: Joi.string().optional().allow(null, ""),
  areaUnit: Joi.string().optional().allow(null, ""),
  totalArea: Joi.number().optional().allow(null, ""),
  landOrLeaseContractType: Joi.string().optional().allow(null, ""),
  numberOfYears: Joi.number().integer().optional().allow(null, ""),
  numberOfMonths: Joi.number().integer().optional().allow(null, ""),
  irrigationAvailability: Joi.boolean().optional().allow(null, ""),
  soilType: Joi.string().optional().allow(null, ""),
  description: Joi.string().optional().allow(null, ""),
  state: Joi.string().optional().allow(null, ""),
  district: Joi.string().optional().allow(null, ""),
  locationOrCity: Joi.string().optional().allow(null, ""),
  pinCodeOrDigiPin: Joi.string().optional().allow(null, ""),
  nameOrCompanyName: Joi.string().optional().allow(null, ""),
  email: Joi.string().email().optional().allow(null, ""),
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
  attachments: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional().allow(null),
  expectedHarvestPeriod: Joi.date().optional().allow(null),
  approxAcreRequirement: Joi.string().optional().allow(null, ""),
  pricePreference: Joi.string().optional().allow(null, ""),
  listingType: Joi.string().optional().allow(null, ""),
});

export const updateStatusSchema = Joi.object({
  id: Joi.number().min(1).required(),
  status: Joi.string()
    .valid(...Object.values(OPEN_MARKET_STATUS))
    .required(),
  reason: Joi.when("status", {
    is: OPEN_MARKET_STATUS.REJECTED,
    then: Joi.string().required().messages({
      "any.required": "reason is required when rejecting open market place",
    }),
    otherwise: Joi.string().optional().allow(null, ""),
  }),
});
