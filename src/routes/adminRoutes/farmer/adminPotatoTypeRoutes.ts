import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import {
  potatoTypeCreateSchema,
  potatoTypeUpdateSchema,
} from "../../../validation/adminValidation";
import {
  addPotatoType,
  deletePotatoType,
  getActivePotatoType,
  getPotatoType,
  updatePotatoType,
} from "../../../controller/adminController/farmer/potatoTypeController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(potatoTypeCreateSchema),
  addPotatoType
);

router.get("/", getPotatoType);

router.get("/active", getActivePotatoType);

router.put(
  "/:id",
  authMiddleware,
  validator.body(potatoTypeUpdateSchema),
  updatePotatoType
);

router.delete("/:id", authMiddleware, deletePotatoType);

export default router;
