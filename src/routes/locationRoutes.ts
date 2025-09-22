import express from "express";
import {
  listCities,
  listDistricts,
  listStates,
  updateCityImage,
} from "../controller/locationController";
import { superAdminMiddleware } from "../utils/userAuth";
import { createValidator } from "express-joi-validation";
import { cityImageSchema } from "../validation/locationValidation";

const router = express.Router();
const validator = createValidator({});

router.get("/states", listStates);
router.get("/cities", listCities);
router.get("/districts", listDistricts);
router.put(
  "/cities/:id/image",
  superAdminMiddleware,
  validator.body(cityImageSchema),
  updateCityImage
);

export default router;
