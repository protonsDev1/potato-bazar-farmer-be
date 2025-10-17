import { createValidator } from "express-joi-validation";
import express from "express";
import { loginSchema, userSchema, createAgentSchema, agentLoginSchema, otpSendSchema, otpVerifySchema, registrationTypesSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, updateProfileSchema, updateRegistrationStatusSchema, mobileLoginSchema, mobileUpdateSchema, createSupportTicketSchema, replyTicketSchema, updateTicketStatusSchema, otpExportSendSchema, verifyAndUpdateMobileNumberSchema, forgotPasswordVerifyOtpSchema, mobileUserPBVerificationSchema, mandiAgentUpdateSchema,  } from "../validation/userValidator";
import {
  agentLogin,
  createAgent,
  forgotPassword,
  getDashboardStats,
  login,
  resetPassword,
  sendOtp,
  signup,
  updateUserRegistrationTypes,
  verifyForgotPasswordOtp,
  verifyOtp,
  getUserProfile,
  changePassword,
  updateProfile,
  retrieveRegistrationTypes,
  getRecentRegistrationsForAdmin,
  adminUpdateRegistrationStatus,
  UserLoginOnMobile,
  retrieveMobileUsers,
  updateMobileUserProfile,
  getMobileUserProfile,
  getMobileUserProfileByAdmin,
  deleteMobileUserByAdmin,
  retrieveAdminDashboardStats,
  createTicket,
  replyToSupportTicket,
  updateSupportTicketStatus,
  listSupportTickets,
  getTicketDetails,
  sendExportOtps,
  resendOtp,
  verifyOldMobileNumberForUpdate,
  verifyNewMobileNumberBeforeUpdate,
  updatePbVerification,
  requestPbVerification,
  getPbVerificationStepStatus,
  getProfileCompletion,
  getMobileUserRoleInformation,
  deleteCurrentMobileUser,
  getMadniAgentProfile,
  updateOwnMandiAgentProfile,
  verifyAndUpdateNewNumber,
} from "../controller/user";
import { adminMiddleware, authMiddleware, checkPermissionMiddleware, checkWebPermissionMiddleware, superAdminMiddleware } from "../utils/userAuth";
import { limitOtpMiddleware } from "../utils/limitOtpRequest";
import { PERMISSIONS, WEB_ACTIONS, WEB_MODULES } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});  


router.post("/signup", validator.body(userSchema), signup);

router.post("/login", validator.body(loginSchema), login);

router.post(
  "/agents",
  checkWebPermissionMiddleware(WEB_MODULES.AGENT, WEB_ACTIONS.CREATE, false),
  validator.body(createAgentSchema),
  createAgent
);

router.post('/agent-login',validator.body(agentLoginSchema), agentLogin);

router.post('/send-otp', validator.body(otpSendSchema), limitOtpMiddleware, sendOtp);

router.post('/verify-otp', validator.body(otpVerifySchema), verifyOtp);

router.post('/resend-otp', validator.body(otpSendSchema), limitOtpMiddleware, resendOtp);

router.post('/export/send-otps', validator.body(otpExportSendSchema), adminMiddleware, sendExportOtps);

router.get('/get-dash-stats', adminMiddleware, getDashboardStats);

router.put('/registration-types',authMiddleware,validator.body(registrationTypesSchema), updateUserRegistrationTypes);

router.get('/user-profile', authMiddleware,  getUserProfile);

router.post('/forgot_password',validator.body(forgotPasswordSchema),limitOtpMiddleware,forgotPassword);

router.post('/forgot_password/verify_otp',validator.body(forgotPasswordVerifyOtpSchema),verifyForgotPasswordOtp);

router.post("/reset_password",validator.body(resetPasswordSchema),resetPassword);

router.put("/change_password",authMiddleware,validator.body(changePasswordSchema),changePassword);

router.put("/update_profile",authMiddleware,validator.body(updateProfileSchema),updateProfile);  // only for admin and agent

router.get("/registration_types", retrieveRegistrationTypes);

router.get("/recent_registrations", adminMiddleware, getRecentRegistrationsForAdmin);

router.put(
  "/update_status",
  authMiddleware,
  validator.body(updateRegistrationStatusSchema),
  adminUpdateRegistrationStatus
);

router.post(
  "/mobile_login",
  validator.body(mobileLoginSchema),
  UserLoginOnMobile
);

router.get(
  "/mobile/list",
  checkPermissionMiddleware([
    PERMISSIONS.USER_MANAGEMENT,
    PERMISSIONS.PB_VERIFICATION,
  ]),
  retrieveMobileUsers // mobile admin users listing
);

router.put(
  "/mobile/update_profile",
  authMiddleware,
  validator.body(mobileUpdateSchema),            // mobile app update profile
  updateMobileUserProfile
);

router.get("/mobile/user_profile", authMiddleware, getMobileUserProfile);       // mobile app user profile overview

router.get(
  "/mobile/user_profile/:userId",
  checkPermissionMiddleware([
    PERMISSIONS.USER_MANAGEMENT,
    PERMISSIONS.PB_VERIFICATION,
  ]),
  getMobileUserProfileByAdmin // mobile admin user profile overview
);

router.get(
  "/mobile/get-verification-steps",
  authMiddleware,
  getPbVerificationStepStatus
);

router.post(
  "/mobile/request-pb-verification",
  authMiddleware,
  requestPbVerification
);

router.put(
  "/mobile/user/:id/pb-verification",
  checkPermissionMiddleware(PERMISSIONS.PB_VERIFICATION),
  validator.body(mobileUserPBVerificationSchema),
  updatePbVerification
);

router.delete("/mobile/:userId", superAdminMiddleware, deleteMobileUserByAdmin);       //  mobile admin delete user

router.get(
  "/admin/dash_stats",
  superAdminMiddleware,          // mobile admin  dashboard stats
  retrieveAdminDashboardStats
); 
router.post(
  "/support",
  authMiddleware,
  validator.body(createSupportTicketSchema),
  createTicket
);

router.post(
  "/support/reply",
  checkPermissionMiddleware(PERMISSIONS.HELP_SUPPORT),
  validator.body(replyTicketSchema),
  replyToSupportTicket
);
router.post(
  "/support/status",
  checkPermissionMiddleware(PERMISSIONS.HELP_SUPPORT),
  validator.body(updateTicketStatusSchema),
  updateSupportTicketStatus
);
router.get(
  "/support",
  checkPermissionMiddleware(PERMISSIONS.HELP_SUPPORT),
  listSupportTickets
);
router.get(
  "/support-details",
  checkPermissionMiddleware(PERMISSIONS.HELP_SUPPORT),
  getTicketDetails
);
router.post(
  "/verify_current_number",
  adminMiddleware,
  validator.body(verifyAndUpdateMobileNumberSchema),
  verifyOldMobileNumberForUpdate
);
router.post(
  "/verify_and_update",
  adminMiddleware,
  validator.body(verifyAndUpdateMobileNumberSchema),
  verifyNewMobileNumberBeforeUpdate
);

router.get(
  "/profile/completion",
  authMiddleware,
  getProfileCompletion
);

router.get(
  "/mobile/profile/role-info",
  authMiddleware,
  getMobileUserRoleInformation
);

router.delete("/mobile", authMiddleware, deleteCurrentMobileUser);  

router.get("/mandi-agent/profile", authMiddleware, getMadniAgentProfile); 

router.put(
  "/mandi-agent/profile",
  authMiddleware,
  validator.body(mandiAgentUpdateSchema),
  updateOwnMandiAgentProfile
);

router.post(
  "/mobile/verify_and_update",
  authMiddleware,
  verifyAndUpdateNewNumber
);

export default router;

