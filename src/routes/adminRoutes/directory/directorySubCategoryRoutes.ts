import { createValidator } from "express-joi-validation";
import express from "express";

import { checkPermissionMiddleware } from "../../../utils/userAuth";
import {
  addDirectorySubCategory,
  deleteDirectorySubCategory,
  getActiveDirectorySubCategory,
  getDirectorySubCategory,
  updateDirectorySubCategory,
} from "../../../controller/adminController/directory/directorySubCategoryController";
import { PERMISSIONS } from "../../../utils/constants/permissions";
import { directorySubCategorySchema } from "../../../validation/directoryValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.DIRECTORY),
  validator.body(directorySubCategorySchema),
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
