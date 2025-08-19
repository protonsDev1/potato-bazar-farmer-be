import Joi from "joi";
import { EVENT_STATUS } from "../database/models/event";

export const createEventSchema = Joi.object({
  email: Joi.string().required(),
  mobile: Joi.string().required(),
  ownerName: Joi.string().optional().allow(null, ""),
  image: Joi.string().optional().allow(null, ""),
  title: Joi.string().required(),
  description: Joi.string().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  location: Joi.string().required(),
  document: Joi.string().optional().allow(null, ""),
  website: Joi.string().optional().allow(null, ""),
});

export const updateEventSchema = Joi.object({
  email: Joi.string().optional().allow(null, ""),
  mobile: Joi.string().optional().allow(null, ""),
  ownerName: Joi.string().optional().allow(null, ""),
  image: Joi.string().optional().allow(null, ""),
  title: Joi.string().optional().allow(null, ""),
  description: Joi.string().optional().allow(null, ""),
  startDate: Joi.string().optional().allow(null, ""),
  endDate: Joi.string().optional().allow(null, ""),
  startTime: Joi.string().optional().allow(null, ""),
  endTime: Joi.string().optional().allow(null, ""),
  location: Joi.string().optional().allow(null, ""),
  document: Joi.string().optional().allow(null, ""),
  website: Joi.string().optional().allow(null, ""),
});

export const updateEventStatusSchema = Joi.object({
  status: Joi.string()
    .valid(EVENT_STATUS.APPROVED, EVENT_STATUS.REJECTED)
    .required(),
});
