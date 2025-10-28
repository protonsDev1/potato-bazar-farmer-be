import express from "express";
import { createValidator } from "express-joi-validation";

import { authMiddleware, superAdminMiddleware } from "../utils/userAuth";
import {
  createPromotionRequest,
  deletePromotionRequest,
  getPromotionRequestById,
  getPromotionRequests,
} from "../controller/promotionRequestController";
import { createPromotionRequestValidation } from "../validation/promitionRequestValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(createPromotionRequestValidation),
  createPromotionRequest
);
router.get("/", superAdminMiddleware, getPromotionRequests);
router.get("/:id", superAdminMiddleware, getPromotionRequestById);
router.delete("/:id", superAdminMiddleware, deletePromotionRequest);

export default router;
