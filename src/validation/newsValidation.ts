import Joi from "joi";
import { NEWS_CATEGORY, NEWS_STATUS } from "../database/models/news";

export const createNewsSchema = Joi.object({
  title: Joi.string().trim().required(),
  category: Joi.string()
    .valid(...Object.values(NEWS_CATEGORY))
    .required(),
  status: Joi.string()
    .valid(...Object.values(NEWS_STATUS))
    .required(),
  description: Joi.string().trim().required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  tags: Joi.array().items(Joi.string().trim()).required(),
});

export const updateNewsSchema = Joi.object({
  title: Joi.string().trim().optional(),
  category: Joi.string()
    .valid(...Object.values(NEWS_CATEGORY))
    .optional(),
  status: Joi.string()
    .valid(...Object.values(NEWS_STATUS))
    .optional(),
  description: Joi.string().trim().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
});
