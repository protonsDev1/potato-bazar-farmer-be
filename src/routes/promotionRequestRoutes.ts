import express from "express";
import { createValidator } from "express-joi-validation";

import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import {
  createPromotionRequest,
  deletePromotionRequest,
  getPromotionRequestById,
  getPromotionRequests,
} from "../controller/promotionRequestController";
import { createPromotionRequestValidation } from "../validation/promitionRequestValidation";
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(createPromotionRequestValidation),
  createPromotionRequest
);
router.get(
  "/",
  checkPermissionMiddleware(PERMISSIONS.DIRECTORY),
  getPromotionRequests
);
router.get(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.DIRECTORY),
  getPromotionRequestById
);
router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.DIRECTORY),
  deletePromotionRequest
);

export default router;
