import express from "express";
import { createValidator } from "express-joi-validation";
import {
  checkPermissionMiddleware,
  optionalAuthMiddleware,
} from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";
import {
  createKnowledgeHubSchema,
  updateKnowledgeHubSchema,
} from "../validation/knowledgeHubValidation";
import {
  createKnowledgeHub,
  deleteKnowledgeHub,
  getKnowledgeHubById,
  listKnowledgeHubs,
  updateKnowledgeHub,
} from "../controller/knowledgeHubController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.KNOWLEDGE_HUB),
  validator.body(createKnowledgeHubSchema),
  createKnowledgeHub
);

router.get("/", listKnowledgeHubs);

router.get("/:id", optionalAuthMiddleware, getKnowledgeHubById);

router.put(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.KNOWLEDGE_HUB),
  validator.body(updateKnowledgeHubSchema),
  updateKnowledgeHub
);

router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.KNOWLEDGE_HUB),
  deleteKnowledgeHub
);

export default router;
