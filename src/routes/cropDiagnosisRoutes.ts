import express from "express";
import { createValidator } from "express-joi-validation";

import {
  createCropDiagnosis,
  listCropDiagnosis,
  getCropDiagnosisById,
  createEndorsement,
  getEndorsements,
  updateEndorsement,
  deleteEndorsement,
} from "../controller/cropDiagnosisController";
import {
  createCropDiagnosisSchema,
  createEndorsementSchema,
} from "../validation/cropDiagnosisValidation";
import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";

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
  checkPermissionMiddleware(PERMISSIONS.ENDORSEMENT),
  validator.body(createEndorsementSchema),
  createEndorsement
);

router.put(
  "/endorsements/:id",
  updateEndorsement
);

router.delete(
  "/endorsements/:id",
  deleteEndorsement
);
export default router;
