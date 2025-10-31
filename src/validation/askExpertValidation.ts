import Joi from "joi";

export const createQuerySchema = Joi.object({
  cropDiagnosedId: Joi.number().integer().required(),
  query: Joi.string().required(), // text
});

export const respondQuerySchema= Joi.object({
  response: Joi.string().required(),     // text
})