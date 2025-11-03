import Joi from "joi";

export const broadcastNotificationSchema = Joi.object({
  title: Joi.string().trim().max(255).required(),
  description: Joi.string().trim().required(), //  Text field
});

export const markAsReadSchema = Joi.object({
  notificationId: Joi.number().integer().optional().allow(null),
  markAll: Joi.boolean().optional(),
});
