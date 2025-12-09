import Joi from "joi";
import { NEWS_STATUS } from "../database/models/news";

export const createNewsSchema = Joi.object({
  title: Joi.string().trim().max(255).required(),
  category: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(NEWS_STATUS))
    .required(),
  description: Joi.string().trim().required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  tags: Joi.array().items(Joi.string().trim()).required(),
  isFeatured: Joi.boolean().default(false),
  createdBy: Joi.string().trim().optional(),
  source: Joi.string().trim().optional(),
  ytVideos: Joi.array().items(Joi.string()).optional(),
  isPanIndia: Joi.boolean().optional(),
  stateId: Joi.number().optional().allow(null),
  districtId: Joi.number().optional().allow(null),

  //  AI optional fields
  introduction: Joi.string().trim().optional(),
  keyNumbers: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
  changesThisWeek: Joi.string().trim().optional(),
  supplyAnalysis: Joi.string().trim().optional(),
  demandSignals: Joi.string().trim().optional(),
  regionalSnapshot: Joi.string().trim().optional(),
  policyRisks: Joi.string().trim().optional(),
  faqs: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().trim().required(),
        answer: Joi.string().trim().required(),
      })
    )
    .optional(),
  references: Joi.array().items(Joi.string().uri()).optional(),
});

export const updateNewsSchema = Joi.object({
  title: Joi.string().trim().optional(),
  category: Joi.string().optional(),
  status: Joi.string()
    .valid(...Object.values(NEWS_STATUS))
    .optional(),
  description: Joi.string().trim().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  isFeatured: Joi.boolean().optional(),
  stateId: Joi.number().optional().allow(null),
  districtId: Joi.number().optional().allow(null),
  source: Joi.string().trim().optional().allow(null, ""),
  ytVideos: Joi.array().items(Joi.string()).optional(),
  isPanIndia: Joi.boolean().optional(),

  //  AI optional fields
  introduction: Joi.string().trim().optional().allow(null, ""),
  keyNumbers: Joi.object()
    .pattern(Joi.string(), Joi.any())
    .optional()
    .allow(null),
  changesThisWeek: Joi.string().trim().optional().allow(null, ""),
  supplyAnalysis: Joi.string().trim().optional().allow(null, ""),
  demandSignals: Joi.string().trim().optional().allow(null, ""),
  regionalSnapshot: Joi.string().trim().optional().allow(null, ""),
  policyRisks: Joi.string().trim().optional().allow(null, ""),
  faqs: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().trim().required(),
        answer: Joi.string().trim().required(),
      })
    )
    .optional()
    .allow(null),
  references: Joi.array().items(Joi.string().uri()).optional().allow(null),
});
