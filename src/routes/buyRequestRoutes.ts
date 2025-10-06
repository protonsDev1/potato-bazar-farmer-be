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
  updateBuyRequestStatus,
} from "../controller/buyRequestController";
import {
  authMiddleware,
  checkPermissionMiddleware,
  optionalAuthMiddleware,
} from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";
import {
  createBuyRequestSchema,
  updateBuyRequestSchema,
  updateBuyRequestStatusSchema,
} from "../validation/buyRequestValidation";

const router = Router();
const validator = createValidator({});

router.post(
  "/create",
  authMiddleware,
  validator.body(createBuyRequestSchema),
  createBuyRequest
);
router.get("/list", optionalAuthMiddleware, listBuyRequests);

router.get("/my_list", authMiddleware, listMyBuyRequests);

router.get(
  "/admin_list",
  checkPermissionMiddleware(PERMISSIONS.BUY_REQUESTS),
  listAdminBuyRequests
);

router.get("/:id", optionalAuthMiddleware, showBuyRequest);
router.delete("/:id", authMiddleware, deleteBuyRequest);

router.put(
  "/:id",
  authMiddleware,
  validator.body(updateBuyRequestSchema),
  updateBuyRequest
);

router.put(
  "/update_status/:requestId",
  checkPermissionMiddleware(PERMISSIONS.BUY_REQUESTS),
  validator.body(updateBuyRequestStatusSchema),
  updateBuyRequestStatus
);

export default router;
