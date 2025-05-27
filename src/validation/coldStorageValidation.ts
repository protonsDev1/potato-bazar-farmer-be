import Joi from 'joi';

export const coldStorageSchema = Joi.object({
  name: Joi.string().required(),
  owner_name: Joi.string().required(),
  contact_number: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  whatsapp_number: Joi.string().pattern(/^[6-9]\d{9}$/).allow('', null),

  village: Joi.string().required(),
  district: Joi.string().required(),
  state: Joi.string().default('Gujarat'),

  gst_available: Joi.boolean().default(false),
  gst_number: Joi.string().when('gst_available', {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.string().optional()
  }),

  total_capacity_mt: Joi.number().min(0).required(),
  storage_meant_for: Joi.array().items(Joi.string().valid('Seed', 'Table', 'Process')).required(),
  storage_type: Joi.array().items(Joi.string().valid('Bag', 'Bulk', 'Box')).required(),
  built_year: Joi.number().optional(),
  construction_type: Joi.string().optional(),

  temperature_control: Joi.boolean().default(false),
  humidity_control: Joi.boolean().default(false),
  power_backup: Joi.boolean().default(false),
  internet_connectivity: Joi.boolean().default(false),
  video_surveillance: Joi.boolean().default(false),

  transport_available: Joi.boolean().default(false),
  market_distance_km: Joi.number().min(0).required(),
  market_linkage: Joi.string().optional(),
});
