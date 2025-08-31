import Joi from "joi";

export const createBuyRequestSchema = Joi.object({
  potatoType: Joi.string().required(),
  potatoVariety: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().valid("Kilogram", "Metric Ton", "Quintal").required(),
  targetPrice: Joi.number().positive().optional(),
  requiredByDate: Joi.date().optional(),
  qualityGrade: Joi.string().valid("Super", "Good", "Average").optional(),
  packagingType: Joi.string().optional(),
  delivery: Joi.string().valid("Ex Farm", "Ex Cold Storage").optional(),
  size: Joi.string().optional(),
  sugarContent: Joi.string().valid("Sugar Free", "Non-Sugar Free").optional(),
  skinSet: Joi.string()
    .valid("Kaccha (Immature Skin / Early Harvest)", "Pakka (Mature Skin)")
    .optional(),
  fleshColor: Joi.string().optional(),
  skinColor: Joi.string().optional(),
  shape: Joi.string().optional(),
  tpod: Joi.number().optional(),
  uc: Joi.number().optional(),
  tuberSize: Joi.string().optional(),
  dryMatter: Joi.number().optional(),
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
  productionDate: Joi.date().optional(),
  organicCertified: Joi.boolean().default(false),
});

export const updateBuyRequestSchema = Joi.object({
  potatoType: Joi.string().optional(),
  potatoVariety: Joi.string().optional(),
  quantity: Joi.number().positive().optional(),
  unit: Joi.string().valid("Kilogram", "Metric Ton", "Quintal").optional(),
  targetPrice: Joi.number().positive().optional(),
  requiredByDate: Joi.date().optional(),
  qualityGrade: Joi.string().valid("Super", "Good", "Average").optional(),
  packagingType: Joi.string().optional(),
  delivery: Joi.string().valid("Ex Farm", "Ex Cold Storage").optional(),
  size: Joi.string().optional(),
  sugarContent: Joi.string().valid("Sugar Free", "Non-Sugar Free").optional(),
  skinSet: Joi.string()
    .valid("Kaccha (Immature Skin / Early Harvest)", "Pakka (Mature Skin)")
    .optional(),
  fleshColor: Joi.string().optional(),
  skinColor: Joi.string().optional(),
  tpod: Joi.number().optional(),
  uc: Joi.number().optional(),
  tuberSize: Joi.string().optional(),
  dryMatter: Joi.number().optional(),
  shape: Joi.string().valid("Gol (Round)", "Lambi Chaal (Oblong)").optional(),
  soilAdherence: Joi.string().valid("Clean", "Partial", "Heavy").optional(),
  firmness: Joi.string().valid("Hard", "Medium", "Soft").optional(),
  sproutingStatus: Joi.string().valid("Sprouted", "Non-Sprouted").optional(),
  organicCertified: Joi.boolean().optional(),
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
  productionDate: Joi.date().optional(),
  isActive: Joi.boolean().optional(),
  status: Joi.string()
    .valid("Pending", "Active", "Completed", "Cancelled")
    .optional(),
});
