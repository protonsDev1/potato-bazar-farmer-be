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

router.post(
  "/",
  authMiddleware,
  validator.body(createCropDiagnosisSchema),
  createCropDiagnosis
);

router.get("/get-endorsements", authMiddleware, getEndorsements);

router.get("/", authMiddleware, listCropDiagnosis);

router.get("/:id", authMiddleware, getCropDiagnosisById);

router.post(
  "/endorsements",
  adminOrSubAdminMiddleware,
  validator.body(createEndorsementSchema),
  createEndorsement
);

export default router;
