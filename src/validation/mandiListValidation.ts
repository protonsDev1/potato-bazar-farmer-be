import Joi from "joi";

export const createMandiSchema = Joi.object({
  cityId: Joi.number().required(),
  mandiName: Joi.string().required(),
  address: Joi.string().optional().allow(null, ""),
  isTopMandi: Joi.boolean().optional(),
  position: Joi.number().integer().optional().allow(null),
});

export const updateMandiSchema = Joi.object({
  mandiName: Joi.string().optional(),
  address: Joi.string().optional().allow(null, ""),
  isTopMandi: Joi.boolean().optional(),
  position: Joi.number().integer().optional().allow(null),
});

export const retrieveAllMandisByCityArraySchema = Joi.object({
  cityIds: Joi.array().items(Joi.number()).required().min(1),
});
