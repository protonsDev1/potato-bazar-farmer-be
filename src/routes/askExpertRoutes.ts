import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import {
  askQuery,
  getAllQueries,
  respondToQuery,
} from "../controller/askExpertController";
import {
  createQuerySchema,
  respondQuerySchema,
} from "../validation/askExpertValidation";
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post("/", authMiddleware, validator.body(createQuerySchema), askQuery);
router.get(
  "/",
  checkPermissionMiddleware(PERMISSIONS.ASK_EXPERT),
  getAllQueries
);
router.put(
  "/:queryId",
  checkPermissionMiddleware(PERMISSIONS.ASK_EXPERT),
  validator.body(respondQuerySchema),
  respondToQuery
);

export default router;
