import { createValidator } from "express-joi-validation";
import express from "express";

import {
  checkPermissionMiddleware,
  checkWebPermissionMiddleware,
} from "../../../utils/userAuth";
import { potatoVarietySchema } from "../../../validation/adminValidation";
import {
  addDirectoryCategory,
  deleteDirectoryCategory,
  getActiveDirectoryCategory,
  getDirectoryCategory,
  updateDirectoryCategory,
} from "../../../controller/adminController/directory/directoryCategoryController";
import {
  PERMISSIONS,
  WEB_ACTIONS,
  WEB_MODULES,
} from "../../../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.DIRECTORY),
  validator.body(potatoVarietySchema),
  addDirectoryCategory
);

router.get("/", getDirectoryCategory);

router.get("/active", getActiveDirectoryCategory);

router.put(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.DIRECTORY),
  updateDirectoryCategory
);

router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.DIRECTORY),
  deleteDirectoryCategory
);

export default router;
