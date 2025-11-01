import express from "express";
import { createValidator } from "express-joi-validation";

import {
  createCropDiagnosis,
  listCropDiagnosis,
  getCropDiagnosisById,
  createEndorsement,
  getEndorsements,
} from "../controller/cropDiagnosisController";
import { createCropDiagnosisSchema, createEndorsementSchema } from "../validation/cropDiagnosisValidation";
import { adminOrSubAdminMiddleware, authMiddleware } from "../utils/userAuth";

const router = express.Router();
const validator = createValidator({});

// ✅ Create crop diagnosis
router.post(
  "/",
  authMiddleware,
  validator.body(createCropDiagnosisSchema),
  createCropDiagnosis
);

// ✅ Get endorsements list — MUST BE BEFORE /:id route
router.get("/get-endorsements", authMiddleware, getEndorsements);

// ✅ List crop diagnosis
router.get("/", authMiddleware, listCropDiagnosis);

// ✅ Get single crop diagnosis by ID (keep LAST among GET routes)
router.get("/:id", authMiddleware, getCropDiagnosisById);

// ✅ Create endorsement
router.post(
  "/endorsements",
  adminOrSubAdminMiddleware,
  validator.body(createEndorsementSchema),
  createEndorsement
);

export default router;
