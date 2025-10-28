import Joi from "joi";

export const createCropDiagnosisSchema = Joi.object({
  disease: Joi.string().trim().required(),
  confidence: Joi.number().min(0).max(100).required(),
  diagnosis: Joi.string().required(),
});
