import Joi from "joi";
import { JOB_STATUS } from "../database/models/job";

export const createJobSchema = Joi.object({
  title: Joi.string().trim().required(),
  category: Joi.string().trim().required(),
  type: Joi.string().trim().required(),
  description: Joi.string().trim().required(),

  educationLevel: Joi.array().items(Joi.string()).allow(null),
  skillsRequired: Joi.array().items(Joi.string()).allow(null),
  experienceRequired: Joi.number().required(),

  workplace: Joi.array().items(Joi.string()).allow(null),
  vacancies: Joi.number().allow(null),
  salaryMin: Joi.number().allow(null),
  salaryMax: Joi.number().allow(null),
  additionalBenefit: Joi.array().items(Joi.string()).allow(null),

  joiningTimeline: Joi.string().allow(null, ""),
  state: Joi.string().allow(null, ""),
  district: Joi.string().allow(null, ""),
  city: Joi.string().allow(null, ""),
  pincode: Joi.string().allow(null, ""),

  companyName: Joi.string().allow(null),
  email: Joi.string().email().allow(null),
  mobile: Joi.string().allow(null),
  alternateMobile: Joi.string().allow(null),

  document: Joi.array().items(Joi.string()).allow(null),
});

export const updateJobSchema = Joi.object({
  title: Joi.string().trim().optional(),
  category: Joi.string().trim().optional(),
  type: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),

  educationLevel: Joi.array().items(Joi.string()).allow(null),
  skillsRequired: Joi.array().items(Joi.string()).allow(null),
  experienceRequired: Joi.number().optional(),

  workplace: Joi.array().items(Joi.string()).allow(null),
  vacancies: Joi.number().allow(null),
  salaryMin: Joi.number().allow(null),
  salaryMax: Joi.number().allow(null),
  additionalBenefit: Joi.array().items(Joi.string()).allow(null),

  joiningTimeline: Joi.string().allow(null),
  state: Joi.string().allow(null),
  district: Joi.string().allow(null),
  city: Joi.string().allow(null),
  pincode: Joi.string().allow(null),

  companyName: Joi.string().allow(null),
  email: Joi.string().email().allow(null),
  mobile: Joi.string().allow(null),
  alternateMobile: Joi.string().allow(null),

  document: Joi.array().items(Joi.string()).allow(null),

  isActive: Joi.boolean().optional(),
});

export const updateJobStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(JOB_STATUS))
    .required(),

  reason: Joi.when("status", {
    is: JOB_STATUS.REJECTED,
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null, ""),
  }),
});
