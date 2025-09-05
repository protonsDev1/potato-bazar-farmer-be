import Joi from "joi";
import { PERMISSIONS } from "../utils/constants/permissions";

export const createSubAdminSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
  privileges: Joi.array()
    .items(Joi.string().valid(...Object.values(PERMISSIONS)))
    .default([]),
});

export const updateSubAdminSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(50).optional(),
  isActive: Joi.boolean().optional(),
  privileges: Joi.array()
    .items(Joi.string().valid(...Object.values(PERMISSIONS)))
    .optional(),
});
