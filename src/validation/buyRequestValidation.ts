import Joi from "joi";

export const createBuyRequestSchema = Joi.object({
  potatoType: Joi.string().required(),
  potatoVariety: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().valid("Kilogram", "Metric Ton", "Quintal").required(),
  targetPrice: Joi.number().positive().optional(),
  requiredByDate: Joi.date().optional(),
  qualityGrade: Joi.string().valid("Super", "Good", "Average").required(),
  packagingType: Joi.string().optional(),
  delivery: Joi.string().valid("Ex Farm", "Ex Cold Storage").optional(),
  size: Joi.number().optional(),
  sugarContent: Joi.string().valid("Sugar Free", "Non Sugar Free").required(),
  skinSet: Joi.string()
    .valid("Kaccha (Immature/Early Harvest)", "Pakka (Mature)")
    .required(),
  fleshColor: Joi.string().required(),
  shape: Joi.string().valid("Gol (Round)", "Lambi Chaal (Oblong)").required(),
  soilAdherence: Joi.string().valid("Clean", "Partial", "Heavy").required(),
  firmness: Joi.string().valid("Hard", "Medium", "Soft").required(),
  sproutingStatus: Joi.string().valid("Sprouted", "Non-Sprouted").required(),
  organicCerified: Joi.boolean().default(false),
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
  size: Joi.number().optional(),
  sugarContent: Joi.string().valid("Sugar Free", "Non Sugar Free").optional(),
  skinSet: Joi.string()
    .valid("Kaccha (Immature/Early Harvest)", "Pakka (Mature)")
    .optional(),
  fleshColor: Joi.string().optional(),
  shape: Joi.string().valid("Gol (Round)", "Lambi Chaal (Oblong)").optional(),
  soilAdherence: Joi.string().valid("Clean", "Partial", "Heavy").optional(),
  firmness: Joi.string().valid("Hard", "Medium", "Soft").optional(),
  sproutingStatus: Joi.string().valid("Sprouted", "Non-Sprouted").optional(),
  organicCerified: Joi.boolean().optional(),
  status: Joi.string().valid("pending", "active", "completed").optional(),
});
