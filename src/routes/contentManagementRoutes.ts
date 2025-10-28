import express from "express";
import { createValidator } from "express-joi-validation";

import { checkPermissionMiddleware } from "../utils/userAuth";

import { createContentManagementValidation } from "../validation/contentManagementValidation";
import {
  createOrUpdateContent,
  getAllContents,
} from "../controller/contentManagementController";
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.CONTENT_MANAGEMENT),
  validator.body(createContentManagementValidation),
  createOrUpdateContent
);
router.get("/", getAllContents);

export default router;
