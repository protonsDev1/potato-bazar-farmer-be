import express from "express";
import { createValidator } from "express-joi-validation";

import { superAdminMiddleware } from "../utils/userAuth";

import { createContentManagementValidation } from "../validation/contentManagementValidation";
import {
  createOrUpdateContent,
  getAllContents,
} from "../controller/contentManagementController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  superAdminMiddleware,
  validator.body(createContentManagementValidation),
  createOrUpdateContent
);
router.get("/", getAllContents);

export default router;
