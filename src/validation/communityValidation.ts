import Joi from "joi";

export const createCommunityPostValidation = Joi.object({
  category: Joi.string().valid("market", "farming", "industry").required(),
  title: Joi.string().optional(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.string()).optional(),
});

export const updateCommunityPostValidation = Joi.object({
  category: Joi.string().valid("market", "farming", "industry").optional().allow(null,""),
  title: Joi.string().optional().allow(null,""),
  description: Joi.string().optional().allow(null,""),
  tags: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.string()).optional(),
});

export const approveRejectValidation = Joi.object({
  status: Joi.string().valid("approved", "rejected").required(),
  adminRemark: Joi.string().optional(),
});
