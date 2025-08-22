import { createValidator } from "express-joi-validation";
import express from "express";
import { loginSchema, userSchema, createAgentSchema, agentLoginSchema, otpSendSchema, otpVerifySchema, registrationTypesSchema, forgotPasswordSchema, resetPasswordSchema, verifyOtpSchema, changePasswordSchema, updateProfileSchema, updateRegistrationStatusSchema, mobileLoginSchema } from "../validation/userValidator";
import { agentLogin, createAgent, forgotPassword, getDashboardStats, login, resetPassword, sendOtp, signup, updateUserRegistrationTypes, verifyForgotPasswordOtp, verifyOtp, getUserProfile, changePassword, updateProfile, retrieveRegistrationTypes, getRecentRegistrationsForAdmin, adminUpdateRegistrationStatus, UserLoginOnMobile, retrieveMobileUsers } from "../controller/user";
import { adminMiddleware, authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import { limitOtpMiddleware } from "../utils/limitOtpRequest";
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});  


router.post("/signup", validator.body(userSchema), signup);

router.post("/login", validator.body(loginSchema), login);

router.post('/agents', adminMiddleware, validator.body(createAgentSchema), createAgent);

router.post('/agent-login',validator.body(agentLoginSchema), agentLogin);

router.post('/send-otp', validator.body(otpSendSchema), sendOtp);

router.post('/verify-otp', validator.body(otpVerifySchema), verifyOtp);

router.get('/get-dash-stats', adminMiddleware, getDashboardStats);

router.put('/registration-types',authMiddleware,validator.body(registrationTypesSchema), updateUserRegistrationTypes);

router.get('/user-profile', authMiddleware,  getUserProfile);

router.post('/forgot_password',validator.body(forgotPasswordSchema),limitOtpMiddleware,forgotPassword);

router.post('/forgot_password/verify_otp',validator.body(verifyOtpSchema),verifyForgotPasswordOtp);

router.post("/reset_password",validator.body(resetPasswordSchema),resetPassword);

router.put("/change_password",authMiddleware,validator.body(changePasswordSchema),changePassword);

router.put("/update_profile",authMiddleware,validator.body(updateProfileSchema),updateProfile);  // only for admin and agent

router.get("/registration_types", retrieveRegistrationTypes);

router.get("/recent_registrations", adminMiddleware, getRecentRegistrationsForAdmin);

router.put(
  "/update_status",
  adminMiddleware,
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
  checkPermissionMiddleware(PERMISSIONS.USER_MANAGEMENT),
  retrieveMobileUsers
);

export default router;

