import Joi from "joi";

export const updateAgentSchema = Joi.object({
  name: Joi.string().optional().allow(null, ""),
  email: Joi.string().email().optional().allow(null),
  mobile: Joi.string().optional().allow(null),

  phone: Joi.string().optional().allow(null),
  address: Joi.string().optional().allow(null, ""),
  state: Joi.string().allow(null, ""),
  district: Joi.string().allow(null, ""),
  note: Joi.string().optional().allow(null, ""),
  isActive: Joi.boolean().optional().allow(null),
});

export const agentMonthlyTargetSchema = Joi.object({
  agentId: Joi.number().required(),
  year: Joi.number().required(),
  month: Joi.string()
    .required()
    .valid(
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ),
  farmerMonthlyTarget: Joi.number().optional().allow(null),
  coldStorageMonthlyTarget: Joi.number().optional().allow(null),
  traderMonthlyTarget: Joi.number().optional().allow(null),
  isEdit: Joi.boolean().optional().default(false),
});
