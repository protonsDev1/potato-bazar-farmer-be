import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { technologyUsedSchema } from "../../../validation/adminValidation";
import {
  addTechnologyUsed,
  deleteTechnologyUsed,
  getTechnologyUsed,
  updateTechnologyUsed,
} from "../../../controller/adminController/farmer/technologyUsedController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(technologyUsedSchema),
  addTechnologyUsed
);

router.get("/", getTechnologyUsed);

router.put("/:id", authMiddleware, updateTechnologyUsed);

router.delete("/:id", authMiddleware, deleteTechnologyUsed);

export default router;
