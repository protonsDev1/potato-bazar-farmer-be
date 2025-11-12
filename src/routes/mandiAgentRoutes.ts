import express from "express";
import { createValidator } from "express-joi-validation";

import { checkPermissionMiddleware } from "../utils/userAuth";
import {
  createMandiAgent,
  deleteMandiAgent,
  retrieveMandiAgentProfile,
  retrieveMandiAgents,
  updateMandiAgent,
} from "../controller/mandiAgentController";
import {
  createMandiAgentSchema,
  updateMandiAgentSchema,
} from "../validation/mandiAgentValidation";
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.MANDI_MANAGEMENT),
  validator.body(createMandiAgentSchema),
  createMandiAgent
);
router.get(
  "/",
  checkPermissionMiddleware(PERMISSIONS.MANDI_MANAGEMENT),
  retrieveMandiAgents
);

router.get(
  "/profile/:mandiAgentId",
  checkPermissionMiddleware(PERMISSIONS.MANDI_MANAGEMENT),
  retrieveMandiAgentProfile
);

router.put(
  "/:mandiAgentId",
  checkPermissionMiddleware(PERMISSIONS.MANDI_MANAGEMENT),
  validator.body(updateMandiAgentSchema),
  updateMandiAgent
);

router.delete(
  "/:mandiAgentId",
  checkPermissionMiddleware(PERMISSIONS.MANDI_MANAGEMENT),
  deleteMandiAgent
);

export default router;
