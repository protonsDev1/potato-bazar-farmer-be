import Joi from "joi";

export const createCommunityPostValidation = Joi.object({
  category: Joi.string().valid("market", "farming", "industry").required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  images: Joi.array().items(Joi.string()).optional()
});

export const approveRejectValidation = Joi.object({
  status: Joi.string().valid("approved", "rejected").required(),
  adminRemark: Joi.string().optional()
});
