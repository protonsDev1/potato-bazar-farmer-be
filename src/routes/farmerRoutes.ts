import { createValidator } from "express-joi-validation";
import express from "express";
import {
  adminMiddleware,
  authMiddleware,
  checkOtpVerified,
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

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create",
  authMiddleware,
  validator.body(onboardFarmerSchema),
  createFarmer
);
router.post(
  "/self_onboard",
  validator.body(onboardFarmerSchema),
  selfOnboardFarmer
);
router.get("/profile/:farmerId", authMiddleware, getProfileOverview);
router.put(
  "/update/:farmerId",
  authMiddleware,
  validator.body(updateFarmerSchema),
  updateFarmer
);
router.get("/", adminMiddleware, getFarmerList);
router.delete("/delete/:id", adminMiddleware, deleteFarmer);
router.post(
  "/export",
  validator.body(verifyOtpSchema),
  adminMiddleware,
  exportFarmers
);

export default router;
