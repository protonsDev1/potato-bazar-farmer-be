import { createValidator } from "express-joi-validation";
import express from "express";
import { loginSchema, userSchema, createAgentSchema, agentLoginSchema, otpSendSchema, otpVerifySchema } from "../validation/userValidator";
import { agentLogin, createAgent, getDashboardStats, login, sendOtp, signup, verifyOtp } from "../controller/user";
import { adminMiddleware } from "../utils/userAuth";

const router = express.Router();
const validator = createValidator({});  


router.post("/signup", validator.body(userSchema), signup);

router.post("/login", validator.body(loginSchema), login);

router.post('/agents', adminMiddleware, validator.body(createAgentSchema), createAgent);

router.post('/agent-login',validator.body(agentLoginSchema), agentLogin);

router.post('/send-otp', validator.body(otpSendSchema), sendOtp);

router.post('/verify-otp', validator.body(otpVerifySchema), verifyOtp);

router.post('/get-dash-stats', adminMiddleware,  getDashboardStats);



export default router;

