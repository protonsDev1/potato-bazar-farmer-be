import express from "express";
import { createValidator } from "express-joi-validation";

import {
  getAndExportAllUserRegistrations,
  sendOtp,
  verifyAndRegister,
} from "../controller/userRegistrationController";
import { userRegistrationSchema } from "../validation/userRegistrationValidation";
import { limitOtpMiddleware } from "../utils/limitOtpRequest";

const router = express.Router();
const validator = createValidator({});

router.post("/send_otp", limitOtpMiddleware, sendOtp);
router.post(
  "/verify_and_register",
  validator.body(userRegistrationSchema),
  verifyAndRegister
);
router.get("/", getAndExportAllUserRegistrations);

export default router;
