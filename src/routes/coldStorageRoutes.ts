import express from "express";
import { createValidator } from "express-joi-validation";
import {
  adminMiddleware,
  authMiddleware,
  checkWebPermissionMiddleware,
} from "../utils/userAuth";
import {
  availabilitySchema,
  coldStorageSchema,
  updateColdStorageSchema,
} from "../validation/coldStorageValidation";
import {
  createColdStorage,
  getColdStorageProfile,
  getColdStorageList,
  selfOnboardColdStorage,
  updateColdStorage,
  deleteColdStorage,
  exportColdStorages,
  likeOrDislikeColdStorage,
  requestUpdateCS,
  verifyUpdateCS,
  updateColdStorageAvailability,
} from "../controller/coldStorage";
import { verifyOtpSchema } from "../validation/userValidator";
import { WEB_ACTIONS, WEB_MODULES } from "../utils/constants/permissions";
import { duplicationCheckMiddleware } from "../middlewares/duplicationCheckMiddleware";
import ColdStorage from "../database/models/coldStorage";
import { limitOtpMiddleware } from "../utils/limitOtpRequest";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create",
  checkWebPermissionMiddleware(
    WEB_MODULES.COLD_STORAGE,
    WEB_ACTIONS.CREATE,
    true
  ),
  validator.body(coldStorageSchema),
  duplicationCheckMiddleware(ColdStorage, "create"),
  createColdStorage
);

router.post(
  "/self_onboard",
  validator.body(coldStorageSchema),
  duplicationCheckMiddleware(ColdStorage, "create"),
  selfOnboardColdStorage
);

router.get("/profile/:id", authMiddleware, getColdStorageProfile);

router.put(
  "/update/:coldStorageId",
  checkWebPermissionMiddleware(
    WEB_MODULES.COLD_STORAGE,
    WEB_ACTIONS.UPDATE,
    true
  ),
  validator.body(updateColdStorageSchema),
  duplicationCheckMiddleware(ColdStorage, "update", "coldStorageId"),
  updateColdStorage
);
router.get("/", authMiddleware, getColdStorageList);
router.delete(
  "/delete/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.COLD_STORAGE,
    WEB_ACTIONS.DELETE,
    false
  ),
  deleteColdStorage
);
router.post(
  "/export",
  validator.body(verifyOtpSchema),
  adminMiddleware,
  exportColdStorages
);
router.post("/like", authMiddleware, likeOrDislikeColdStorage);
router.post(
  "/:coldStorageId/request-mobile-update",
  checkWebPermissionMiddleware(
    WEB_MODULES.COLD_STORAGE,
    WEB_ACTIONS.UPDATE,
    false
  ),
  limitOtpMiddleware,
  requestUpdateCS
);

router.post(
  "/:coldStorageId/verify-mobile-update",
  checkWebPermissionMiddleware(
    WEB_MODULES.COLD_STORAGE,
    WEB_ACTIONS.UPDATE,
    false
  ),
  verifyUpdateCS
);

router.patch(
  "/:coldStorageId/availability",
  authMiddleware,
  validator.body(availabilitySchema),
  updateColdStorageAvailability
);

export default router;
