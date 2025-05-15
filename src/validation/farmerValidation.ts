import Joi from 'joi';

export const farmerSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),

  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  whatsapp: Joi.string().pattern(/^[6-9]\d{9}$/).allow('', null),

  village: Joi.string().required(),
  taluka: Joi.string().required(),
  district: Joi.string().required(),
  state: Joi.string().default('Gujarat'),

  hasAadhaar: Joi.boolean().default(false),
  hasBankAccount: Joi.boolean().default(false),

  land_owned_acres: Joi.number().min(0).required(),
  land_leased_acres: Joi.number().min(0).required(),
  potato_cultivation_acres: Joi.number().min(0).required(),

  farming_type: Joi.string().valid('Own Land', 'Lease', 'Both').required(),

  irrigation_sources: Joi.array().items(
    Joi.string().valid('Canal', 'Borewell', 'Rainfed', 'Drip', 'Sprinkler')
  ).required(),

  soil_type: Joi.string().valid('Sandy', 'Clayey', 'Loamy').required(),

  potato_variety: Joi.array().items(
    Joi.string().valid('Table', 'Chips', 'French Fry')
  ).required(),

  sowing_month: Joi.string().required(),
  harvest_month: Joi.string().required(),

  equipment_used: Joi.array().items(
    Joi.string().valid(
      'Sowing Machine',
      'Pesticide Sprayer',
      'Potato Seed Cutter',
      'Harvester',
      'Third Party Application'
    )
  ).optional(),

  sale_percent: Joi.number().min(0).max(100).optional(),
  storage_percent: Joi.number().min(0).max(100).optional(),

  uses_storage: Joi.boolean().default(false),

  selling_place: Joi.string().valid(
    'Local Mandi',
    'Cold Storage Buyer',
    'Contract Farming',
    'Direct to Trader',
    'Any Other'
  ).required(),

  distance_to_market: Joi.string().required(),

  does_grading: Joi.boolean().default(false),

  price_decision_factors: Joi.array().items(
    Joi.string().valid('Mandi Rates', 'Neighbouring Farmers', 'Trader\'s Offer', 'Any Other')
  ).optional(),

  selling_challenges: Joi.array().items(
    Joi.string().valid(
      'Price Fluctuation',
      'Storage',
      'Lack of Direct Buyers',
      'Transport Cost',
      'Any Other'
    )
  ).optional()
});
