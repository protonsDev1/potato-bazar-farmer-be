import express from "express";
import { createValidator } from "express-joi-validation";
import {
  createKycSchema,
  updateKycStatusSchema,
} from "../validation/kycValidation";
import {
  upsertKyc,
  approveOrRejectKyc,
  listKyc,
  getKycDetail,
  getMyKycDetail,
} from "../controller/kycController";
import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post("/", authMiddleware, validator.body(createKycSchema), upsertKyc);
router.patch(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.KYC_REQUESTS),
  validator.body(updateKycStatusSchema),
  approveOrRejectKyc
);
router.get("/", checkPermissionMiddleware(PERMISSIONS.KYC_REQUESTS), listKyc);
router.get("/my", authMiddleware, getMyKycDetail);
router.get(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.KYC_REQUESTS),
  getKycDetail
);

export default router;
