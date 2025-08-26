import Joi from "joi";
import { ARRIVAL_STATUS } from "../database/models/mandiPrice";
import { MANDI_GRADE_TYPE } from "../database/models/mandiGradePrice";

export const createMandiPriceSchema = Joi.object({
  mandiName: Joi.string().required(),
  date: Joi.string().required(),
  variety: Joi.string().required(),
  category: Joi.string().required(),
  arrivalStatus: Joi.string()
    .valid(...Object.values(ARRIVAL_STATUS))
    .required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  totalArrivalBags: Joi.number().integer().required(),
  normalMandiArrivalBags: Joi.number().integer().required(),
  gradeWisePricing: Joi.array()
    .items(
      Joi.object({
        mandiGradeType: Joi.string()
          .valid(...Object.values(MANDI_GRADE_TYPE))
          .required(),
        gradeArrivalPercentage: Joi.number().required(),
        gradePricePerKg: Joi.number().required(),
        quantityInBags: Joi.number().integer().required(),
      })
    )
    .required()
    .min(1),
});

export const updateMandiPriceSchema = Joi.object({
  variety: Joi.string().optional(),
  category: Joi.string().optional(),
  arrivalStatus: Joi.string()
    .valid(...Object.values(ARRIVAL_STATUS))
    .optional(),
  state: Joi.string().optional(),
  city: Joi.string().optional(),
  totalArrivalBags: Joi.number().integer().optional(),
  normalMandiArrivalBags: Joi.number().integer().optional(),
  gradeWisePricing: Joi.array()
    .items(
      Joi.object({
        mandiGradeType: Joi.string()
          .valid(...Object.values(MANDI_GRADE_TYPE))
          .optional(),
        gradeArrivalPercentage: Joi.number().optional(),
        gradePricePerKg: Joi.number().optional(),
        quantityInBags: Joi.number().integer().optional(),
      })
    )
    .optional(),
});
