import { createValidator } from "express-joi-validation";
import express from "express";
import { authMiddleware } from "../../../utils/userAuth";
import {
  addBrandPreferenceReason,
  deleteBrandPreferenceReason,
  getActiveBrandPreferenceReasons,
  getBrandPreferenceReasons,
  updateBrandPreferenceReason,
} from "../../../controller/adminController/farmer/brandPreferenceReasonController";
import {
  brandPreferenceReasonCreateSchema,
  brandPreferenceReasonUpdateSchema,
} from "../../../validation/adminValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(brandPreferenceReasonCreateSchema),
  addBrandPreferenceReason
);
router.get("/", authMiddleware, getBrandPreferenceReasons);
router.get("/active", authMiddleware, getActiveBrandPreferenceReasons);
router.put(
  "/:id",
  authMiddleware,
  validator.body(brandPreferenceReasonUpdateSchema),
  updateBrandPreferenceReason
);
router.delete("/:id", authMiddleware, deleteBrandPreferenceReason);

export default router;
