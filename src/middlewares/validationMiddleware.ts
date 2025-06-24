import Joi from "joi";

export const validateRequest = (
  schema: Joi.ObjectSchema,
  property: "body" | "query" | "params" = "body"
) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: true,
      allowUnknown: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    next();
  };
};
