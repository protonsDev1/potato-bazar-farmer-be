import Joi from "joi";

export const createCommunityPostValidation = Joi.object({
  category: Joi.string().valid("market", "farming", "industry").required(),
  title: Joi.string().optional(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.string()).optional(),
});

export const updateCommunityPostValidation = Joi.object({
  category: Joi.string()
    .valid("market", "farming", "industry")
    .optional()
    .allow(null, ""),
  title: Joi.string().optional().allow(null, ""),
  description: Joi.string().optional().allow(null, ""),
  tags: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.string()).optional(),
});

export const approveRejectValidation = Joi.object({
  status: Joi.string().valid("approved", "rejected").required(),
  adminRemark: Joi.when("status", {
    is: "rejected",
    then: Joi.string().required(),
    otherwise: Joi.string().optional().allow(null, ""),
  }),
});

export const reportOnPostValidation = Joi.object({
  reason: Joi.string().required(),
});

export const updateStatusofReportValidation = Joi.object({
  status: Joi.string().required().valid("pending", "resolved"),
});
