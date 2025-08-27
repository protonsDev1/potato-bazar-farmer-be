import Joi from "joi";
import { VALID_ACTIONS, VALID_MODULES } from "../utils/constants/permissions";

export const createSubAdminWebSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
  privileges: Joi.array()
    .items(
      Joi.object({
        module: Joi.string()
          .valid(...VALID_MODULES)
          .required(),
        actions: Joi.array()
          .items(Joi.string().valid(...VALID_ACTIONS))
          .min(1)
          .required(),
      })
    )
    .default([]),
});

export const updateSubAdminWebSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(50).optional(),
  isActive: Joi.boolean().optional(),
  privileges: Joi.array()
    .items(
      Joi.object({
        module: Joi.string()
          .valid(...VALID_MODULES)
          .required(),
        actions: Joi.array()
          .items(Joi.string().valid(...VALID_ACTIONS))
          .min(1)
          .required(),
      })
    )
    .optional(),
});
