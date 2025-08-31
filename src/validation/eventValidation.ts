import Joi from "joi";
import { EVENT_REQUEST_STATUS } from "../database/models/eventRequest";

export const createEventSchema = Joi.object({
  email: Joi.string().required(),
  mobile: Joi.string().required(),
  organiserName: Joi.string().optional().allow(null, ""),
  image: Joi.array().items(Joi.string()).optional(),
  category: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  state: Joi.string().required(),
  district: Joi.string().required(),
  city: Joi.string().optional().allow(null, ""),
  location: Joi.string().required(),
  document: Joi.array().items(Joi.string()).optional(),
  website: Joi.string().optional().allow(null, ""),
  isFeatured: Joi.boolean().optional().allow(null, ""),
});

export const updateEventSchema = Joi.object({
  email: Joi.string().optional().allow(null, ""),
  mobile: Joi.string().optional().allow(null, ""),
  organiserName: Joi.string().optional().allow(null, ""),
  image: Joi.array().items(Joi.string()).optional(),
  title: Joi.string().optional().allow(null, ""),
  category: Joi.string().optional().allow(null, ""),
  description: Joi.string().optional().allow(null, ""),
  startDate: Joi.string().optional().allow(null, ""),
  endDate: Joi.string().optional().allow(null, ""),
  startTime: Joi.string().optional().allow(null, ""),
  endTime: Joi.string().optional().allow(null, ""),
  location: Joi.string().optional().allow(null, ""),
  state: Joi.string().optional().allow(null, ""),
  district: Joi.string().optional().allow(null, ""),
  city: Joi.string().optional().allow(null, ""),
  document: Joi.array().items(Joi.string()).optional(),
  website: Joi.string().optional().allow(null, ""),
  isFeatured: Joi.boolean().optional().allow(null, ""),
});

export const updateEventStatusSchema = Joi.object({
  status: Joi.string()
    .valid(EVENT_REQUEST_STATUS.APPROVED, EVENT_REQUEST_STATUS.REJECTED)
    .required(),
});
