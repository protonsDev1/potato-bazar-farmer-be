import Joi from "joi";

export const cityImageSchema = Joi.object({
  image: Joi.string().uri().required(),
});
