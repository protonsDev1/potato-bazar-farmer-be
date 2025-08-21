import { Router } from "express";
import { createValidator } from "express-joi-validation";
import {
  createBuyRequest,
  deleteBuyRequest,
  listAdminBuyRequests,
  listBuyRequests,
  listMyBuyRequests,
  showBuyRequest,
  updateBuyRequest,
} from "../controller/buyRequestController";
import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";
import {
  createBuyRequestSchema,
  updateBuyRequestSchema,
} from "../validation/buyRequestValidation";

const router = Router();
const validator = createValidator({});

router.post(
  "/create",
  authMiddleware,
  validator.body(createBuyRequestSchema),
  createBuyRequest
);
router.get("/list", authMiddleware, listBuyRequests);

router.get("/my_list", authMiddleware, listMyBuyRequests);

router.get(
  "/admin_list",
  checkPermissionMiddleware(PERMISSIONS.BUY_REQUESTS),
  listAdminBuyRequests
);

router.get("/:id", showBuyRequest);
router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.BUY_REQUESTS),
  deleteBuyRequest
);

router.put(
  "/:id",
  authMiddleware,
  validator.body(updateBuyRequestSchema),
  updateBuyRequest
);

export default router;
