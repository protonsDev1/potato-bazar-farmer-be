import express from "express";
import { createValidator } from "express-joi-validation";

import {
  deleteUserRegistration,
  getAndExportAllUserRegistrations,
  sendOtp,
  verifyAndRegister,
} from "../controller/userRegistrationController";
import { userRegistrationSchema } from "../validation/userRegistrationValidation";
import { limitOtpMiddleware } from "../utils/limitOtpRequest";
import { adminMiddleware } from "../utils/userAuth";

const router = express.Router();
const validator = createValidator({});

router.post("/send_otp", limitOtpMiddleware, sendOtp);
router.post(
  "/verify_and_register",
  validator.body(userRegistrationSchema),
  verifyAndRegister
);
router.get("/", adminMiddleware, getAndExportAllUserRegistrations);
router.delete("/:id", adminMiddleware, deleteUserRegistration);

export default router;
