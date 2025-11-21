import Joi from "joi";
import { GOV_SCHEME_CATEGORY } from "../database/models/govScheme";

export const createGovSchemeSchema = Joi.object({
  title: Joi.string().trim().required(),
  category: Joi.string()
    .valid(...Object.values(GOV_SCHEME_CATEGORY))
    .required(),
  governmentType: Joi.string().valid("Central", "State").required(),
  state: Joi.when("governmentType", {
    is: "State",
    then: Joi.string().trim().required(),
    otherwise: Joi.string().allow(null, "").optional(),
  }),
  description: Joi.string().trim().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
  document: Joi.string().uri().allow("").optional(),
  mobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .allow("", null),
  email: Joi.string().email().optional().allow("", null),
  websiteUrl: Joi.string().uri().allow(null, "").optional(),
  ageLimit: Joi.string().allow(null, "").optional(),
  contactUrl: Joi.string().uri().allow(null, "").optional(),
  isActive: Joi.boolean().default(true),
});

export const updateGovSchemeSchema = Joi.object({
  title: Joi.string().trim().optional(),
  category: Joi.string()
    .valid(...Object.values(GOV_SCHEME_CATEGORY))
    .optional(),
  governmentType: Joi.string().valid("Central", "State").optional(),
  state: Joi.when("governmentType", {
    is: "State",
    then: Joi.string().trim().required(),
    otherwise: Joi.string().allow(null, "").optional(),
  }),
  description: Joi.string().trim().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().greater(Joi.ref("startDate")).optional(),
  document: Joi.string().uri().allow("").optional(),
  mobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .allow(null, "")
    .optional(),
  email: Joi.string().email().allow(null, "").optional(),
  websiteUrl: Joi.string().uri().allow(null, "").optional(),
  ageLimit: Joi.string().allow(null, "").optional(),
  contactUrl: Joi.string().uri().allow(null, "").optional(),
  isActive: Joi.boolean().optional(),
});
