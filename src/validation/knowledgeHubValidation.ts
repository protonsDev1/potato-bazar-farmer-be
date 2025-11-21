import Joi from "joi";
import { NEWS_STATUS } from "../database/models/news";

export const createKnowledgeHubSchema = Joi.object({
  title: Joi.string().trim().max(255).required(),
  category: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(NEWS_STATUS))
    .required(),
  description: Joi.string().trim().required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  isFeatured: Joi.boolean().default(false),
  source: Joi.string().trim().optional(),
  ytVideos: Joi.array().items(Joi.string()).optional(),
  isPanIndia: Joi.boolean().optional(),
  stateId: Joi.number().optional().allow(null),
  districtId: Joi.number().optional().allow(null),
});

export const updateKnowledgeHubSchema = Joi.object({
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
  source: Joi.string().trim().optional(),
  ytVideos: Joi.array().items(Joi.string()).optional(),
  isPanIndia: Joi.boolean().optional(),
});
