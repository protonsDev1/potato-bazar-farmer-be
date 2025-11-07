import { createValidator } from "express-joi-validation";
import express from "express";

import { checkPermissionMiddleware } from "../../../utils/userAuth";
import {
  addDirectoryCategory,
  deleteDirectoryCategory,
  getActiveDirectoryCategory,
  getDirectoryCategory,
  updateDirectoryCategory,
} from "../../../controller/adminController/directory/directoryCategoryController";
import { PERMISSIONS } from "../../../utils/constants/permissions";
import { directoryCategorySchema } from "../../../validation/directoryValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.DIRECTORY),
  validator.body(directoryCategorySchema),
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
