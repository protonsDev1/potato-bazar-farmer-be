import Joi from "joi";
import { SELL_REQUEST_STATUS } from "../database/models/sellRequest";

export const createSellRequestSchema = Joi.object({
  potatoType: Joi.string().required(),
  potatoVariety: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().valid("Kilogram", "Metric Ton", "Quintal").required(),
  targetPrice: Joi.number().positive().optional(),
  minOrderQuantity: Joi.string().optional(),
  qualityGrade: Joi.string().valid("Super", "Good", "Average").optional(),
  packagingType: Joi.string().optional(),
  delivery: Joi.string().valid("Ex Farm", "Ex Cold Storage", "FOR").optional(),
  size: Joi.string().optional().allow(null, ""),
  deliveryLocation: Joi.string().optional().allow(null, ""),
  sugarContent: Joi.string().valid("Sugar Free", "Non-Sugar Free").optional(),
  skinSet: Joi.string().optional(),
  fleshColor: Joi.string().optional(),
  skinColor: Joi.string().optional(),
  shape: Joi.string().optional(),
  tpod: Joi.number().optional(),
  uc: Joi.number().optional(),
  tuberSize: Joi.string().optional(),
  dryMatter: Joi.string().optional(),
  soilAdherence: Joi.string().valid("Clean", "Partial", "Heavy").optional(),
  firmness: Joi.string().valid("Hard", "Medium", "Soft").optional(),
  sproutingStatus: Joi.string().valid("Sprouted", "Non-Sprouted").optional(),
  healthCondition: Joi.string().optional(),
  additionalComment: Joi.string().optional(),
  storageTemperature: Joi.string().optional(),
  brand: Joi.string().optional(),
  generation: Joi.string().valid("G1", "G2", "G3", "G4", "G5").optional(),
  treatmentStatus: Joi.string().valid("Treated", "Untreated").optional(),
  seedSourceType: Joi.string()
    .valid("Tissue Culture", "Breeder Seed")
    .optional(),
  sproutingCondition: Joi.string()
    .valid("Chitting", "Sprouted", "No Sprouting")
    .optional(),
  physicalCondition: Joi.string().optional(),
  roguingStatus: Joi.string().valid("Yes", "No").optional(),
  perTubeWeight: Joi.string().optional(),
  diseaseFreeCertified: Joi.string().valid("Yes", "No").optional(),
  productionMethod: Joi.string().optional(),
  shapeType: Joi.string().optional(),
  productionDate: Joi.date().optional(),
  organicCertified: Joi.boolean().default(false),
  images: Joi.array().items(Joi.string()).optional(),
  location: Joi.string().optional(),
});

export const updateSellRequestSchema = Joi.object({
  potatoType: Joi.string().optional(),
  potatoVariety: Joi.string().optional(),
  quantity: Joi.number().positive().optional(),
  unit: Joi.string().valid("Kilogram", "Metric Ton", "Quintal").optional(),
  targetPrice: Joi.number().positive().optional(),
  minOrderQuantity: Joi.string().optional(),
  qualityGrade: Joi.string().valid("Super", "Good", "Average").optional(),
  packagingType: Joi.string().optional(),
  delivery: Joi.string().valid("Ex Farm", "Ex Cold Storage", "FOR").optional(),
  size: Joi.string().optional().allow(null, ""),
  deliveryLocation: Joi.string().optional().allow(null, ""),
  sugarContent: Joi.string().valid("Sugar Free", "Non-Sugar Free").optional(),
  skinSet: Joi.string().optional(),
  fleshColor: Joi.string().optional(),
  skinColor: Joi.string().optional(),
  shape: Joi.string().optional(),
  tpod: Joi.number().optional(),
  uc: Joi.number().optional(),
  tuberSize: Joi.string().optional(),
  dryMatter: Joi.string().optional(),
  soilAdherence: Joi.string().valid("Clean", "Partial", "Heavy").optional(),
  firmness: Joi.string().valid("Hard", "Medium", "Soft").optional(),
  sproutingStatus: Joi.string().valid("Sprouted", "Non-Sprouted").optional(),
  healthCondition: Joi.string().optional(),
  additionalComment: Joi.string().optional(),
  storageTemperature: Joi.string().optional(),
  brand: Joi.string().optional(),
  generation: Joi.string().valid("G1", "G2", "G3", "G4", "G5").optional(),
  treatmentStatus: Joi.string().valid("Treated", "Untreated").optional(),
  seedSourceType: Joi.string()
    .valid("Tissue Culture", "Breeder Seed")
    .optional(),
  sproutingCondition: Joi.string()
    .valid("Chitting", "Sprouted", "No Sprouting")
    .optional(),
  physicalCondition: Joi.string().optional(),
  roguingStatus: Joi.string().valid("Yes", "No").optional(),
  perTubeWeight: Joi.string().optional(),
  diseaseFreeCertified: Joi.string().valid("Yes", "No").optional(),
  productionMethod: Joi.string().optional(),
  shapeType: Joi.string().optional(),
  productionDate: Joi.date().optional(),
  organicCertified: Joi.boolean().optional(),
  images: Joi.array().items(Joi.string()).optional(),
  location: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});

export const updateSellRequestStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(SELL_REQUEST_STATUS))
    .required(),
  reason: Joi.when("status", {
    is: SELL_REQUEST_STATUS.REJECTED,
    then: Joi.string().required().messages({
      "any.required": "reason is required when rejecting sell request",
    }),
    otherwise: Joi.string().optional().allow(null, ""),
  }),
});
