import Joi from "joi";

export const updateAgentSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  mobile: Joi.string().optional(),

  phone: Joi.string().optional(),
  address: Joi.string().optional().allow(""),
  state: Joi.string().optional(),
  district: Joi.string().optional(),
  note: Joi.string().optional().allow(""),
  isActive: Joi.boolean().optional(),
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
  monthlyTarget: Joi.number().required(),
  isEdit: Joi.boolean().optional().default(false),
});
