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
import { duplicationCheckMiddleware } from "../middlewares/duplicationCheckMiddleware";
import Farmer from "../database/models/farmer";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create",
  checkWebPermissionMiddleware(WEB_MODULES.FARMER, WEB_ACTIONS.CREATE, true),
  validator.body(onboardFarmerSchema),
  duplicationCheckMiddleware(Farmer, "create"),
  createFarmer
);
router.post(
  "/self_onboard",
  validator.body(onboardFarmerSchema),
  duplicationCheckMiddleware(Farmer, "create"),
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
  duplicationCheckMiddleware(Farmer, "update", "farmerId"),
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
