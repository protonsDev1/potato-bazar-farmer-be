import express from "express";
import { createValidator } from "express-joi-validation";

import { checkPermissionMiddleware } from "../utils/userAuth";

import { PERMISSIONS } from "../utils/constants/permissions";
import {
  addMandi,
  deleteMandi,
  getAllMandi,
  getAllMandiByCity,
  retrieveAllMandisByCityArray,
  updateMandi,
} from "../controller/mandiListController";
import {
  createMandiSchema,
  retrieveAllMandisByCityArraySchema,
  updateMandiSchema,
} from "../validation/mandiListValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.MANDI_MANAGEMENT),
  validator.body(createMandiSchema),
  addMandi
);

router.post(
  "/list_by_city_ids",
  checkPermissionMiddleware(PERMISSIONS.MANDI_MANAGEMENT),
  validator.body(retrieveAllMandisByCityArraySchema),
  retrieveAllMandisByCityArray
);

router.get(
  "/",
  checkPermissionMiddleware(PERMISSIONS.MANDI_MANAGEMENT),
  getAllMandi
);

router.get("/:cityId", getAllMandiByCity);

router.put(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.MANDI_MANAGEMENT),
  validator.body(updateMandiSchema),
  updateMandi
);

router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.MANDI_MANAGEMENT),
  deleteMandi
);

export default router;
