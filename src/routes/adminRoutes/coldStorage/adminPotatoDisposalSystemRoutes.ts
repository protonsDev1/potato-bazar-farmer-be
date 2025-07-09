import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addPotatoDisposalSystem,
  deletePotatoDisposalSystem,
  getActivePotatoDisposalSystem,
  getPotatoDisposalSystem,
  updatePotatoDisposalSystem,
} from "../../../controller/adminController/coldStorage/potatoDisposalSystemController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(adminColdStorageSchema),
  addPotatoDisposalSystem
);

router.get("/", getPotatoDisposalSystem);

router.get("/active", getActivePotatoDisposalSystem);

router.put("/:id", authMiddleware, updatePotatoDisposalSystem);

router.delete("/:id", authMiddleware, deletePotatoDisposalSystem);

export default router;
