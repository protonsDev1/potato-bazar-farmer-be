import Joi from "joi";

export const cityImageSchema = Joi.object({
  image: Joi.string().uri().optional(),
  position: Joi.number().integer().optional(),
});
