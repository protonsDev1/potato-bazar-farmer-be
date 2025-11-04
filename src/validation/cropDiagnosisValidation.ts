import Joi from "joi";

export const createCropDiagnosisSchema = Joi.object({
  disease: Joi.string().trim().required(),
  confidence: Joi.number().min(0).max(100).required(),
  diagnosis: Joi.string().required(),
  image: Joi.string().uri().required(),
});

export const createEndorsementSchema = Joi.object({
  brandName: Joi.string().trim().required().messages({
    "string.base": "Brand name must be a string",
    "any.required": "Brand name is required",
  }),

  productName: Joi.string().trim().required().messages({
    "string.base": "Product name must be a string",
    "any.required": "Product name is required",
  }),

  title: Joi.string().trim().required().messages({
    "string.base": "Title must be a string",
    "any.required": "Title is required",
  }),

  headline: Joi.string().trim().required().messages({
    "string.base": "Headline must be a string",
    "any.required": "Headline is required",
  }),

  disease: Joi.array().items(Joi.string().trim()).required().messages({
    "array.base": "Disease must be an array of strings",
    "any.required": "Disease is required",
  }),

  cta_text: Joi.string().trim().allow(null, "").messages({
    "string.base": "CTA text must be a string",
  }),

  cta_url: Joi.string().uri().trim().allow(null, "").messages({
    "string.uri": "CTA URL must be valid",
  }),

  start_at: Joi.date().allow(null).messages({
    "date.base": "Start date must be a valid date",
  }),

  end_at: Joi.date().greater(Joi.ref("start_at")).allow(null).messages({
    "date.base": "End date must be a valid date",
    "date.greater": "End date must be after start date",
  }),

  status: Joi.string()
    .valid("draft", "approved", "paused", "archived")
    .default("draft")
    .messages({
      "any.only": "Status must be one of draft, approved, paused, archived",
    }),

  image: Joi.string().uri().trim().allow(null, "").messages({
    "string.uri": "Image URL must be valid",
  }),

  notes: Joi.string().trim().allow(null, ""),

  sort_order: Joi.number().integer().default(0).messages({
    "number.base": "Sort order must be a number",
  }),
  isCommon: Joi.boolean().default(false),
});
