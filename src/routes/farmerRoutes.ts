import { createValidator } from "express-joi-validation";
import express from "express";
import {
  adminMiddleware,
  adminOrSubAdminMiddleware,
  authMiddleware,
  checkOtpVerified,
  checkWebPermissionMiddleware,
} from "../utils/userAuth";
import {
  onboardFarmerSchema,
  updateFarmerSchema,
} from "../validation/farmerValidation";
import {
  createFarmer,
  getProfileOverview,
  getFarmerList,
  selfOnboardFarmer,
  updateFarmer,
  exportFarmers,
  deleteFarmer,
} from "../controller/farmer";
import { verifyOtpSchema } from "../validation/userValidator";
import { WEB_ACTIONS, WEB_MODULES } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create",
  checkWebPermissionMiddleware(WEB_MODULES.FARMER, WEB_ACTIONS.CREATE, true),
  validator.body(onboardFarmerSchema),
  createFarmer
);
router.post(
  "/self_onboard",
  validator.body(onboardFarmerSchema),
  selfOnboardFarmer
);
router.get(
  "/profile/:farmerId",
  checkWebPermissionMiddleware(WEB_MODULES.FARMER, WEB_ACTIONS.VIEW, true),
  getProfileOverview
);
router.put(
  "/update/:farmerId",
  checkWebPermissionMiddleware(WEB_MODULES.FARMER, WEB_ACTIONS.UPDATE, true),
  validator.body(updateFarmerSchema),
  updateFarmer
);
router.get("/", adminOrSubAdminMiddleware, getFarmerList);
router.delete(
  "/delete/:id",
  checkWebPermissionMiddleware(WEB_MODULES.FARMER, WEB_ACTIONS.DELETE, false),
  deleteFarmer
);
router.post(
  "/export",
  validator.body(verifyOtpSchema),
  adminMiddleware,
  exportFarmers
);

export default router;
