import Joi from "joi";

export const broadcastNotificationSchema = Joi.object({
  title: Joi.string().trim().max(255).required(),
  description: Joi.string().trim().required(), //  Text field
});

export const markAsReadSchema = Joi.object({
  notificationId: Joi.number().integer().optional().allow(null),
  markAll: Joi.boolean().optional().allow(null),
});

export const deleteNotificationSchema = Joi.object({
  deleteAll: Joi.boolean().optional().allow(null),
  notificationIds: Joi.array().items(Joi.number().integer()).optional(),
});

export const updateNotificationSettingsSchema = Joi.object({
  allowAll: Joi.boolean().optional(),
  buy: Joi.boolean().optional(),
  sell: Joi.boolean().optional(),
  mandiPrice: Joi.boolean().optional(),
  broadcast: Joi.boolean().optional(),
  news: Joi.boolean().optional(),
  event: Joi.boolean().optional(),
  govScheme: Joi.boolean().optional(),
  coldStorage: Joi.boolean().optional(),
  knowledegeHub: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    "object.min":
      "At least one field must be provided to update notification settings.",
    "object.unknown": "Unknown field(s) provided in the request.",
  });
