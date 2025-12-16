import Joi from "joi";
import { PriorityEnum, StatusEnum } from "../database/models/helpAndSupport";
import { TICKET_PRIORITY } from "../database/models/userSupport";
import { PB_VERIFICATION_STATUS } from "../database/models/user";

// Define the Joi schema for user signup validation
export const userSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Name should be a type of string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should have a maximum of 100 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of string",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).max(20).required().messages({
    "string.base": "Password should be a type of string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password should have at least 6 characters",
    "string.max": "Password should have a maximum of 20 characters",
    "any.required": "Password is required",
  }),

  role: Joi.string()
    .valid("agent", "user") // optional but can have predefined values
    .optional()
    .messages({
      "string.base": "Role should be a type of string",
      "any.only": "Role must be one of [agent, admin, user]",
    }),

  location: Joi.string().optional().allow(null, ""),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const createAgentSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().optional().allow(null),
  phone: Joi.string().optional().allow(null),
  address: Joi.string().optional().allow(null, ""),
  district: Joi.string().optional().allow(null, ""),
  state: Joi.string().optional().allow(null, ""),
  note: Joi.string().optional().allow(null, ""),
}).or("email", "phone");

export const agentLoginSchema = Joi.object({
  agentId: Joi.string().required(),
  password: Joi.string().required(),
});

export const otpSendSchema = Joi.object({
  mobile: Joi.string()
    .optional()
    .pattern(/^[6-9]\d{9}$/)
    .allow(null),
  email: Joi.string().email().optional().allow(null),
}).or("email", "mobile");

export const otpExportSendSchema = Joi.object({
  mobile: Joi.string()
    .required()
    .pattern(/^[6-9]\d{9}$/),
  secondaryMobile: Joi.string()
    .required()
    .pattern(/^[6-9]\d{9}$/),
});

export const otpVerifySchema = Joi.object({
  mobile: Joi.string()
    .required()
    .pattern(/^[6-9]\d{9}$/),
  otp: Joi.string().required().length(6),
  hasStartedUsingMobile: Joi.boolean().optional().allow(null),
  playerId: Joi.string().optional().allow(null),
  playerIdForWeb: Joi.string().optional().allow(null),
  deviceType: Joi.string().optional().allow(null),
});

export const createUserSchema = Joi.object({
  mobile: Joi.string()
    .required()
    .pattern(/^[6-9]\d{9}$/)
});

export const registrationTypesSchema = Joi.object({
  mobile: Joi.string().required().messages({
    "any.required": "Mobile is required",
  }),

  registration_types: Joi.array()
    .items(Joi.string().valid("farmer", "cold_storage", "trader"))
    .min(1)
    .required()
    .messages({
      "array.includes": "registration_types must contain only valid values",
      "any.required": "registration_types is required",
      "array.min": "At least one registration type is required",
    }),
});

export const forgotPasswordSchema = Joi.object({
  mobile: Joi.string()
    .optional()
    .pattern(/^[6-9]\d{9}$/)
    .allow(null), // mobile is unique , "" is not allowed
  email: Joi.string().email().optional().allow(null), // email is unique , "" is not allowed
}).or("email", "mobile");

export const forgotPasswordVerifyOtpSchema = Joi.object({
  mobile: Joi.string()
    .optional()
    .pattern(/^[6-9]\d{9}$/)
    .allow(null), // mobile is unique , "" is not allowed
  email: Joi.string().email().optional().allow(null), // email is unique , "" is not allowed
  otp: Joi.string().required().length(6),
}).or("email", "mobile");

export const verifyOtpSchema = Joi.object({
  mobile: Joi.string()
    .required()
    .pattern(/^[6-9]\d{9}$/),
  mobileOtp: Joi.string().required().length(6),
  secondaryMobile: Joi.string()
    .required()
    .pattern(/^[6-9]\d{9}$/),
  secondaryMobileOtp: Joi.string().required().length(6),
});

export const resetPasswordSchema = Joi.object({
  mobile: Joi.string()
    .optional()
    .pattern(/^[6-9]\d{9}$/)
    .allow(null), // mobile is unique , "" is not allowed
  email: Joi.string().email().optional().allow(null), // email is unique , "" is not allowed
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
}).or("email", "mobile");

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmNewPassword: Joi.string().required(),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().optional().allow(null, ""),
  email: Joi.string().optional().allow(null), // email is unique , "" is not allowed
  mobile: Joi.string().optional().allow(null), // mobile is unique , "" is not allowed
  location: Joi.string().optional().allow(null, ""),
});

export const helpAndSupportSchema = Joi.object({
  subject: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string()
    .valid(...Object.values(PriorityEnum))
    .required(),
});

export const adminReplySchema = Joi.object({
  reply: Joi.string().required(),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(StatusEnum))
    .required(),
});

export const updateRegistrationStatusSchema = Joi.object({
  status: Joi.string().required(),
  userType: Joi.string().required(),
  userId: Joi.string().required(),
  reason: Joi.string().optional().allow(null, ""),
});

export const mobileLoginSchema = Joi.object({
  mobile: Joi.string().required(),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  userType: Joi.array().items(Joi.string()).optional(),
  location: Joi.string().optional().allow(null, ""),
  state: Joi.string().required(),
  district: Joi.string().required(),
  cityOrVillage: Joi.string().required(),
  pinCode: Joi.string().optional().allow(null, ""),
  playerId: Joi.string().optional().allow(null),
});

export const mobileUpdateSchema = Joi.object({
  firstName: Joi.string().trim().optional().allow(null, ""),
  lastName: Joi.string().trim().optional().allow(null, ""),
  location: Joi.string().optional().allow(null, ""),
  state: Joi.string().optional().allow(null, ""),
  cityOrVillage: Joi.string().optional().allow(null, ""),
  pinCode: Joi.string().optional().allow(null, ""),
  email: Joi.string().optional().allow(null), // email is unique , "" is not allowed
  bio: Joi.string().optional().allow(null, ""),
  profilePicture: Joi.string().optional().allow(null, ""),
  userType: Joi.array().items(Joi.string()).optional(),
  district: Joi.string().optional().allow(null, ""),
});

export const mandiAgentUpdateSchema = Joi.object({
  licenseNumber: Joi.string().trim().optional().allow(null, ""),
  remarks: Joi.string().trim().optional().allow(null, ""),
  firstName: Joi.string().trim().optional().allow(null, ""),
  lastName: Joi.string().trim().optional().allow(null, ""),
  email: Joi.string().email().trim().optional().allow(null), // email is unique , "" is not allowed
  mobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .allow(null), // mobile is unique , "" is not allowed
  state: Joi.string().trim().optional().allow(null, ""),
  district: Joi.string().trim().optional().allow(null, ""),
  city: Joi.string().trim().optional().allow(null, ""),
  pinCode: Joi.string()
    .pattern(/^\d{6}$/)
    .message("Pin code must be a 6-digit number")
    .optional()
    .allow(null, ""),
});

export const createSupportTicketSchema = Joi.object({
  subject: Joi.string().trim().required(),
  category: Joi.string().trim().required(),
  priority: Joi.string()
    .valid(...Object.values(TICKET_PRIORITY))
    .default(TICKET_PRIORITY.MEDIUM),
});

export const replyTicketSchema = Joi.object({
  ticketId: Joi.number().required(),
  reply: Joi.string().trim().required(),
});

export const updateTicketStatusSchema = Joi.object({
  ticketId: Joi.number().required(),
  status: Joi.string()
    .valid("Open", "In Progress", "Resolved", "Closed")
    .required(),
});

export const verifyAndUpdateMobileNumberSchema = Joi.object({
  mobile: Joi.string()
    .required()
    .pattern(/^[6-9]\d{9}$/),
  otp: Joi.string().required(),
  mobileNumberType: Joi.string().required(),
});

export const mobileUserPBVerificationSchema = Joi.object({
  pbVerificationStatus: Joi.string()
    .valid(...Object.values(PB_VERIFICATION_STATUS))
    .required(),
  reason: Joi.when("pbVerificationStatus", {
    is: PB_VERIFICATION_STATUS.REJECTED,
    then: Joi.string().required().messages({
      "any.required": "reason is required when rejecting PB verification",
    }),
    otherwise: Joi.string().optional().allow(null, ""),
  }),
});

export const updateMobileUserStatusSchema = Joi.object({
  isActive: Joi.boolean().required(),
});
