import express from "express";

import { createValidator } from "express-joi-validation";
import { adminMiddleware } from "../utils/userAuth";
import {
  createSubAdminWeb,
  deleteSubAdminWeb,
  getSubAdminWebById,
  listSubAdminWebs,
  updateSubAdminWeb,
} from "../controller/subAdminWebController";
import {
  createSubAdminWebSchema,
  updateSubAdminWebSchema,
} from "../validation/subAdminWebValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  adminMiddleware,
  validator.body(createSubAdminWebSchema),
  createSubAdminWeb
);

router.get("/", adminMiddleware, listSubAdminWebs);

router.put(
  "/:id",
  adminMiddleware,
  validator.body(updateSubAdminWebSchema),
  updateSubAdminWeb
);

router.get("/:id", adminMiddleware, getSubAdminWebById);

router.delete("/:id", adminMiddleware, deleteSubAdminWeb);

export default router;
