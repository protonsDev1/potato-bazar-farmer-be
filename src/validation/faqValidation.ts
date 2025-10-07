import Joi from "joi";

export const createFaqValidation = Joi.object({
  categoryId: Joi.number().integer().required(),
  question: Joi.string().required(),
  answer: Joi.string().required(),
});

export const updateFaqValidation = Joi.object({
  categoryId: Joi.number().integer().optional(),
  question: Joi.string().optional(),
  answer: Joi.string().optional(),
});
