import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware } from "../utils/userAuth";
import {
  createRequirementWithInterests,
  deleteRequirement,
  getRequirementById,
  getRequirements,
  likeOrDislikeCSRequirement,
  updateRequirement,
} from "../controller/csRequirementController";
import {
  createColdStorageRequirementSchema,
  updateColdStorageRequirementSchema,
} from "../validation/csRequirementValidation";

const router = express.Router();
const validator = createValidator({});

router.get("/", authMiddleware, getRequirements);

router.get("/:id", authMiddleware, getRequirementById);

router.post(
  "/",
  authMiddleware,
  validator.body(createColdStorageRequirementSchema),
  createRequirementWithInterests
);

router.put(
  "/:id",
  authMiddleware,
  validator.body(updateColdStorageRequirementSchema),
  updateRequirement
);

router.delete("/:id", authMiddleware, deleteRequirement);

router.post("/:requirementId/like", authMiddleware, likeOrDislikeCSRequirement);

export default router;
