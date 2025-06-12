import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { operationalChallengeSchema } from "../../../validation/adminValidation";
import {
  addOperationalChallenge,
  deleteOperationalChallenge,
  getActiveOperationalChallenge,
  getOperationalChallenge,
  updateOperationalChallenge,
} from "../../../controller/adminController/coldStorage/operationalChallengeController";
import { getActiveBiggestChallengeInSelling } from "../../../controller/adminController/farmer/biggestChallengeInSelling";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(operationalChallengeSchema),
  addOperationalChallenge
);

router.get("/", getOperationalChallenge);

router.get("/active", getActiveOperationalChallenge);

router.put("/:id", authMiddleware, updateOperationalChallenge);

router.delete("/:id", authMiddleware, deleteOperationalChallenge);

export default router;
