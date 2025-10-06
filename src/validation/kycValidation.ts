import Joi from "joi";

export const createKycSchema = Joi.object({
  panFront: Joi.string().uri().optional().messages({
    "string.uri": "PAN Front must be a valid URL",
  }),
  aadhaarFront: Joi.string().uri().required().messages({
    "any.required": "Aadhaar Front is required",
    "string.uri": "Aadhaar Front must be a valid URL",
  }),
  aadhaarBack: Joi.string().uri().required().messages({
    "any.required": "Aadhaar Back is required",
    "string.uri": "Aadhaar Back must be a valid URL",
  }),
  gstNumber: Joi.string().optional(),
  fssaiNumber: Joi.string().optional(),
});

export const updateKycStatusSchema = Joi.object({
  isVerified: Joi.boolean().required().messages({
    "any.required": "Verification status is required",
  }),
  reason: Joi.string().optional(),
});
