import express from "express";
import { createValidator } from "express-joi-validation";

import {
  getAndExportAllUserRegistrations,
  sendOtp,
  verifyAndRegister,
} from "../controller/userRegistrationController";
import { userRegistrationSchema } from "../validation/userRegistrationValidation";

const router = express.Router();
const validator = createValidator({});

router.post("/send_otp", sendOtp);
router.post(
  "/verify_and_register",
  validator.body(userRegistrationSchema),
  verifyAndRegister
);
router.get("/", getAndExportAllUserRegistrations);

export default router;
