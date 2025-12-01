import express from "express";
import {
  listCities,
  listDistricts,
  listStates,
  updateCityImage,
} from "../controller/locationController";
import {
  checkPermissionMiddleware,
  superAdminMiddleware,
} from "../utils/userAuth";
import { createValidator } from "express-joi-validation";
import { cityImageSchema } from "../validation/locationValidation";
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.get("/states", listStates);
router.get("/cities", listCities);
router.get("/districts", listDistricts);
router.put(
  "/cities/:id/image",
  checkPermissionMiddleware(PERMISSIONS.MANDI_MANAGEMENT),
  validator.body(cityImageSchema),
  updateCityImage
);

export default router;
