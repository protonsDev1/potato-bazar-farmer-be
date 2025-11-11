import { createValidator } from "express-joi-validation";
import express from "express";
import {
  authMiddleware,
  checkPermissionMiddleware,
  optionalAuthMiddleware,
} from "../utils/userAuth";
import {
  createDirectory,
  deleteDirectory,
  getDirectoryList,
  getDirectoryDetail,
  selfOnboardedDirectory,
  updateDirectory,
  toggleSaveDirectory,
  getDirectoryPlans,
} from "../controller/directoryController";
import {
  onboardDirectorySchema,
  updateDirectorySchema,
} from "../validation/directoryValidation";
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create",
  checkPermissionMiddleware(PERMISSIONS.DIRECTORY),
  validator.body(onboardDirectorySchema),
  // duplicationCheckMiddleware(Directory, "create"),
  createDirectory
);

router.post(
  "/self_onboard",
  validator.body(onboardDirectorySchema),
  // duplicationCheckMiddleware(Directory, "create"),
  selfOnboardedDirectory
);

router.put(
  "/:directoryId",
  checkPermissionMiddleware(PERMISSIONS.DIRECTORY),
  validator.body(updateDirectorySchema),
  // duplicationCheckMiddleware(Directory, "update", "directoryId"),
  updateDirectory
);

router.get("/plans", getDirectoryPlans);

router.get("/", optionalAuthMiddleware, getDirectoryList);

router.get("/:directoryId", optionalAuthMiddleware, getDirectoryDetail);

router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.DIRECTORY),
  deleteDirectory
);

router.post("/:directoryId/save", authMiddleware, toggleSaveDirectory);

export default router;
