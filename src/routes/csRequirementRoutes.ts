import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import {
  createRequirementWithInterests,
  deleteRequirement,
  getRequirementById,
  getRequirements,
  likeOrDislikeCSRequirement,
  updateCSRequirementStatus,
  updateRequirement,
} from "../controller/csRequirementController";
import {
  createColdStorageRequirementSchema,
  updateColdStorageRequirementSchema,
  updateCSRequirementStatusSchema,
} from "../validation/csRequirementValidation";
import { PERMISSIONS } from "../utils/constants/permissions";

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

router.put(
  "/update_status/:requirementId",
  checkPermissionMiddleware(PERMISSIONS.COLD_STORAGE),
  validator.body(updateCSRequirementStatusSchema),
  updateCSRequirementStatus
);

export default router;
