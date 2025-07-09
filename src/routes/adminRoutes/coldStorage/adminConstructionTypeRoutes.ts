import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addConstructionType,
  deleteConstructionType,
  getActiveConstructionType,
  getConstructionType,
  updateConstructionType,
} from "../../../controller/adminController/coldStorage/constructionTypeController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(adminColdStorageSchema),
  addConstructionType
);

router.get("/", getConstructionType);

router.get("/active", getActiveConstructionType);

router.put("/:id", authMiddleware, updateConstructionType);

router.delete("/:id", authMiddleware, deleteConstructionType);

export default router;
