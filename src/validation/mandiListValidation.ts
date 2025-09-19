import Joi from "joi";

export const createMandiSchema = Joi.object({
  cityId: Joi.number().required(),
  mandiName: Joi.string().required(),
});

export const updateMandiSchema = Joi.object({
  mandiName: Joi.string().required(),
});
