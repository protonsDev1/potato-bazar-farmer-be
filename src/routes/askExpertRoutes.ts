import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import {
  askQuery,
  getAllMyQueries,
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
  checkPermissionMiddleware(PERMISSIONS.CROP_DIAGNOSIS),
  getAllQueries
);
router.put(
  "/:queryId",
  checkPermissionMiddleware(PERMISSIONS.CROP_DIAGNOSIS),
  validator.body(respondQuerySchema),
  respondToQuery
);
router.get("/my_queries", authMiddleware, getAllMyQueries);

export default router;
