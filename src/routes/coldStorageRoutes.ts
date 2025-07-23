import express from "express";
import { createValidator } from "express-joi-validation";
import { adminMiddleware, authMiddleware } from "../utils/userAuth";
import {
  coldStorageSchema,
  updateColdStorageSchema,
} from "../validation/coldStorageValidation";
import {
  createColdStorage,
  getColdStorageProfile,
  getColdStorageList,
  selfOnboardColdStorage,
  updateColdStorage,
  deleteColdStorage,
  exportColdStorages,
} from "../controller/coldStorage";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create",
  validator.body(coldStorageSchema),
  authMiddleware,
  createColdStorage
);

router.post(
  "/self_onboard",
  validator.body(coldStorageSchema),
  selfOnboardColdStorage
);

router.get("/profile/:id", authMiddleware, getColdStorageProfile);

router.put(
  "/update/:coldStorageId",
  authMiddleware,
  validator.body(updateColdStorageSchema),
  updateColdStorage
);
router.get("/", adminMiddleware, getColdStorageList);
router.delete("/delete/:id", adminMiddleware, deleteColdStorage);
router.get("/export", adminMiddleware, exportColdStorages);

export default router;
