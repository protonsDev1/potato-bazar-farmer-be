import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { potatoSubVarietySchema } from "../../../validation/adminValidation";
import {
  addPotatoSubVarietyGrown,
  deletePotatoSubVariety,
  getActivePotatoSubVarietyGrown,
  getPotatoSubVarietyGrown,
  updatePotatoSubVariety,
} from "../../../controller/adminController/farmer/potatoSubVarietyController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(potatoSubVarietySchema),
  addPotatoSubVarietyGrown
);

router.get("/", getPotatoSubVarietyGrown);

router.get("/active", getActivePotatoSubVarietyGrown);

router.put("/:id", authMiddleware, updatePotatoSubVariety);

router.delete("/:id", authMiddleware, deletePotatoSubVariety);
export default router;
