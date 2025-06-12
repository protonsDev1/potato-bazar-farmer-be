import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { potatoVarietySchema } from "../../../validation/adminValidation";
import {
  addPotatoVarietyGrown,
  deletePotatoVariety,
  getPotatoVarietyGrown,
  updatePotatoVariety,
} from "../../../controller/adminController/farmer/potatoVarietyController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(potatoVarietySchema),
  addPotatoVarietyGrown
);

router.get("/", getPotatoVarietyGrown);

router.put("/:id", authMiddleware, updatePotatoVariety);

router.delete("/:id", authMiddleware, deletePotatoVariety);

export default router;
