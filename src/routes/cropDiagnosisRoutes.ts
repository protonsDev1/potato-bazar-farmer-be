import express from "express";
import { createValidator } from "express-joi-validation";

import {
  createCropDiagnosis,
  listCropDiagnosis,
  getCropDiagnosisById,
} from "../controller/cropDiagnosisController";
import { createCropDiagnosisSchema } from "../validation/cropDiagnosisValidation";
import { authMiddleware } from "../utils/userAuth";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(createCropDiagnosisSchema),
  createCropDiagnosis
);

router.get("/", authMiddleware, listCropDiagnosis);

router.get("/:id", authMiddleware, getCropDiagnosisById);

export default router;
