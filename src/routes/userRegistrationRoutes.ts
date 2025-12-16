import express from "express";
import { createValidator } from "express-joi-validation";

import {
  deleteUserRegistration,
  getAndExportAllUserRegistrations,
  matchAppVersion,
  sendOtp,
  upsertAppVersion,
  verifyAndRegister,
} from "../controller/userRegistrationController";

import {
  matchAppVersionSchema,
  userRegistrationSchema,
} from "../validation/userRegistrationValidation";

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


router.post(
  "/upsert-version",
  validator.body(matchAppVersionSchema),
  upsertAppVersion
);

router.get(
  "/match-app-version",
  matchAppVersion
);


router.get("/", adminMiddleware, getAndExportAllUserRegistrations);

router.delete("/:id", adminMiddleware, deleteUserRegistration);

export default router;
