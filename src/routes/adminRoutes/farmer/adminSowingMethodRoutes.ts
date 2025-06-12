import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { sowingMethodSchema } from "../../../validation/adminValidation";
import {
  addSowingMethod,
  deleteSowingMethod,
  getActiveSowingMethod,
  getSowingMethod,
  updateSowingMethod,
} from "../../../controller/adminController/farmer/sowingMethodController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(sowingMethodSchema),
  addSowingMethod
);

router.get("/", getSowingMethod);

router.get("/active", getActiveSowingMethod);

router.put("/:id", authMiddleware, updateSowingMethod);

router.delete("/:id", authMiddleware, deleteSowingMethod);

export default router;
