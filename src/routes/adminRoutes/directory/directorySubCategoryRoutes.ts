import { createValidator } from "express-joi-validation";
import express from "express";

import { checkPermissionMiddleware } from "../../../utils/userAuth";
import { potatoSubVarietySchema } from "../../../validation/adminValidation";
import {
  addDirectorySubCategory,
  deleteDirectorySubCategory,
  getActiveDirectorySubCategory,
  getDirectorySubCategory,
  updateDirectorySubCategory,
} from "../../../controller/adminController/directory/directorySubCategoryController";
import { PERMISSIONS } from "../../../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.DIRECTORY),
  validator.body(potatoSubVarietySchema),
  addDirectorySubCategory
);

router.get("/", getDirectorySubCategory);

router.get("/active", getActiveDirectorySubCategory);

router.put(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.DIRECTORY),
  updateDirectorySubCategory
);

router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.DIRECTORY),
  deleteDirectorySubCategory
);
export default router;
