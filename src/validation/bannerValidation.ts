import Joi from "joi";

export const createBannerSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().uri().required().messages({
    "any.required": "Image URL is required",
    "string.uri": "Image must be a valid URL",
  }),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  redirectionUrl: Joi.string().uri().optional().allow(null, ""),
  position: Joi.number().optional().allow(null),
  isActive: Joi.boolean().default(false),
});

export const updateBannerSchema = Joi.object({
  name: Joi.string().allow(null, "").optional(),
  image: Joi.string().uri().optional(),
  startDate: Joi.date().optional().allow(null),
  endDate: Joi.date().optional().allow(null),
  redirectionUrl: Joi.string().uri().optional().allow(null, ""),
  position: Joi.number().optional().allow(null),
  isActive: Joi.boolean().optional(),
});
