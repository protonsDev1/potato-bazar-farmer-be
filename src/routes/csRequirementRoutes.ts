import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware } from "../utils/userAuth";
import { createRequirementWithInterests, getMyRequirements } from "../controller/csRequirementController";
import { createColdStorageRequirementSchema } from "../validation/csRequirementValidation";

const router = express.Router();
const validator = createValidator({});

router.get("/my_requirements", authMiddleware, getMyRequirements);

router.post(
  "/hire_cold_storage",
  authMiddleware,
  validator.body(createColdStorageRequirementSchema),
  createRequirementWithInterests
);

export default router;
