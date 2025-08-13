import express from "express";

import { createValidator } from "express-joi-validation";
import { superAdminMiddleware } from "../utils/userAuth";
import {
  createSubAdminSchema,
  updateSubAdminSchema,
} from "../validation/subAdminValidation";
import {
  createSubAdmin,
  deleteSubAdmin,
  getSubAdminById,
  listSubAdmins,
  updateSubAdmin,
} from "../controller/subAdminController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  superAdminMiddleware,
  validator.body(createSubAdminSchema),
  createSubAdmin
);

router.get("/", superAdminMiddleware, listSubAdmins);

router.put(
  "/:id",
  superAdminMiddleware,
  validator.body(updateSubAdminSchema),
  updateSubAdmin
);

router.get("/:id", superAdminMiddleware, getSubAdminById);

router.delete("/:id", superAdminMiddleware, deleteSubAdmin);

export default router;
