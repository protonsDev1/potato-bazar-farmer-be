import { createValidator } from "express-joi-validation";
import express from "express";

import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import { biggestChallengeInSellingSchema } from "../../../validation/adminValidation";
import {
  addBiggestChallengeInSelling,
  deleteBiggestChallengeInSelling,
  getActiveBiggestChallengeInSelling,
  getBiggestChallengeInSelling,
  updateBiggestChallengeInSelling,
} from "../../../controller/adminController/farmer/biggestChallengeInSelling";
import { WEB_ACTIONS, WEB_MODULES } from "../../../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(biggestChallengeInSellingSchema),
  addBiggestChallengeInSelling
);

router.get("/", getBiggestChallengeInSelling);

router.get("/active", getActiveBiggestChallengeInSelling);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  updateBiggestChallengeInSelling
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteBiggestChallengeInSelling
);

export default router;
