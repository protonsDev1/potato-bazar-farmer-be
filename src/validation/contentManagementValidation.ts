import Joi from "joi";

export const createContentManagementValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});
