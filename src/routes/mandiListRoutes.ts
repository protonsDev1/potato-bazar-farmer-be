import express from "express";
import { createValidator } from "express-joi-validation";

import { checkPermissionMiddleware } from "../utils/userAuth";

import { PERMISSIONS } from "../utils/constants/permissions";
import {
  addMandi,
  deleteMandi,
  getAllMandiByCity,
  updateMandi,
} from "../controller/mandiListController";
import {
  createMandiSchema,
  updateMandiSchema,
} from "../validation/mandiListValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.MANDI_AGENTS),
  validator.body(createMandiSchema),
  addMandi
);
router.get(
  "/:cityId",
  checkPermissionMiddleware(PERMISSIONS.MANDI_AGENTS),
  getAllMandiByCity
);

router.put(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.MANDI_AGENTS),
  validator.body(updateMandiSchema),
  updateMandi
);

router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.MANDI_AGENTS),
  deleteMandi
);

export default router;
