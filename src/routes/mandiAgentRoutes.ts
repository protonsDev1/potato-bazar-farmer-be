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
  checkPermissionMiddleware(PERMISSIONS.MANDI_AGENTS),
  validator.body(createMandiAgentSchema),
  createMandiAgent
);
router.get(
  "/",
  checkPermissionMiddleware(PERMISSIONS.MANDI_AGENTS),
  retrieveMandiAgents
);

router.get(
  "/profile/:mandiAgentId",
  checkPermissionMiddleware(PERMISSIONS.MANDI_AGENTS),
  retrieveMandiAgentProfile
);

router.put(
  "/:mandiAgentId",
  checkPermissionMiddleware(PERMISSIONS.MANDI_AGENTS),
  validator.body(updateMandiAgentSchema),
  updateMandiAgent
);

router.delete(
  "/:mandiAgentId",
  checkPermissionMiddleware(PERMISSIONS.MANDI_AGENTS),
  deleteMandiAgent
);

export default router;
