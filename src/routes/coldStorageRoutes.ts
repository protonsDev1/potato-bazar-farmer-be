import express from "express";
import { createValidator } from "express-joi-validation";
import {
  adminMiddleware,
  adminOrSubAdminMiddleware,
  authMiddleware,
  checkWebPermissionMiddleware,
} from "../utils/userAuth";
import {
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
} from "../controller/coldStorage";
import { verifyOtpSchema } from "../validation/userValidator";
import { WEB_ACTIONS, WEB_MODULES } from "../utils/constants/permissions";

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
  createColdStorage
);

router.post(
  "/self_onboard",
  validator.body(coldStorageSchema),
  selfOnboardColdStorage
);

router.get(
  "/profile/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.COLD_STORAGE,
    WEB_ACTIONS.VIEW,
    true
  ),
  getColdStorageProfile
);

router.put(
  "/update/:coldStorageId",
  checkWebPermissionMiddleware(
    WEB_MODULES.COLD_STORAGE,
    WEB_ACTIONS.UPDATE,
    true
  ),
  validator.body(updateColdStorageSchema),
  updateColdStorage
);
router.get("/", adminOrSubAdminMiddleware, getColdStorageList);
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

export default router;
