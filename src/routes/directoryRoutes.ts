import { createValidator } from "express-joi-validation";
import express from "express";
import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
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
import { duplicationCheckMiddleware } from "../middlewares/duplicationCheckMiddleware";
import Directory from "../database/models/directory";

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

router.get("/", authMiddleware, getDirectoryList);

router.get("/:directoryId", authMiddleware, getDirectoryDetail);

router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.DIRECTORY),
  deleteDirectory
);

router.post("/:directoryId/save", authMiddleware, toggleSaveDirectory);

export default router;
