import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";
import {
  createRequirementWithInterests,
  deleteRequirement,
  getRequirementById,
  getTransportRequirements,
  likeOrDislikeTransportRequirement,
  updateRequirement,
} from "../controller/transportRequirementController";
import {
  createTransportRequirementSchema,
  updateStatusSchema,
  updateTransportRequirementSchema,
} from "../validation/transportRequirementValidation";

const router = express.Router();
const validator = createValidator({});

router.get("/", authMiddleware, getTransportRequirements);

router.get("/:id", authMiddleware, getRequirementById);

router.post(
  "/",
  authMiddleware,
  validator.body(createTransportRequirementSchema),
  createRequirementWithInterests,
);

router.put(
  "/:id",
  authMiddleware,
  validator.body(updateTransportRequirementSchema),
  updateRequirement,
);

router.delete("/:id", authMiddleware, deleteRequirement);

router.post(
  "/:requirementId/like",
  authMiddleware,
  likeOrDislikeTransportRequirement,
);

router.put(
  "/update_status/:requirementId",
  checkPermissionMiddleware(PERMISSIONS.TRANSPORT_SERVICE),
  validator.body(updateStatusSchema),
  updateRequirement,
);

export default router;
