import { createValidator } from "express-joi-validation";
import express from "express";
import { loginSchema, userSchema, createAgentSchema, agentLoginSchema, otpSendSchema, otpVerifySchema, registrationTypesSchema, forgotPasswordSchema, resetPasswordSchema, verifyOtpSchema } from "../validation/userValidator";
import { agentLogin, createAgent, forgotPassword, getDashboardStats, login, resetPassword, sendOtp, signup, updateUserRegistrationTypes, verifyForgotPasswordOtp, verifyOtp, getUserProfile } from "../controller/user";
import { adminMiddleware, authMiddleware } from "../utils/userAuth";
import { limitOtpMiddleware } from "../utils/limitOtpRequest";

const router = express.Router();
const validator = createValidator({});  


router.post("/signup", validator.body(userSchema), signup);

router.post("/login", validator.body(loginSchema), login);

router.post('/agents', adminMiddleware, validator.body(createAgentSchema), createAgent);

router.post('/agent-login',validator.body(agentLoginSchema), agentLogin);

router.post('/send-otp', validator.body(otpSendSchema), sendOtp);

router.post('/verify-otp', validator.body(otpVerifySchema), verifyOtp);

router.post('/get-dash-stats', adminMiddleware,  getDashboardStats);

router.put('/registration-types',authMiddleware,validator.body(registrationTypesSchema), updateUserRegistrationTypes);

router.get('/user-profile', adminMiddleware,  getUserProfile);

router.post('/forgot_password',validator.body(forgotPasswordSchema),limitOtpMiddleware,forgotPassword);

router.post('/forgot_password/verify_otp',validator.body(verifyOtpSchema),verifyForgotPasswordOtp);

router.post("/reset_password",validator.body(resetPasswordSchema),resetPassword);

export default router;

