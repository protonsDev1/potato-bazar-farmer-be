import { createValidator } from "express-joi-validation";
import express from "express";

import { checkPermissionMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";

import { PERMISSIONS } from "../../../utils/constants/permissions";
import {
  addFaqCategory,
  deleteFaqCategory,
  getActiveFaqCategory,
  getFaqCategory,
  updateFaqCategory,
} from "../../../controller/adminController/mobile/faqCategoryController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.FAQ),
  validator.body(adminColdStorageSchema),
  addFaqCategory
);

router.get("/", getFaqCategory);

router.get("/active", getActiveFaqCategory);

router.put(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.FAQ),
  updateFaqCategory
);

router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.FAQ),
  deleteFaqCategory
);

export default router;
