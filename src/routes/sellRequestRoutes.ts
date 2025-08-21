import { Router } from "express";
import { createValidator } from "express-joi-validation";
import {
  createSellRequest,
  deleteSellRequest,
  listAdminSellRequests,
  listSellRequests,
  listMySellRequests,
  showSellRequest,
  updateSellRequest,
} from "../controller/sellRequestController";
import {
  authMiddleware,
  checkPermissionMiddleware,
  optionalAuthMiddleware,
} from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";
import {
  createSellRequestSchema,
  updateSellRequestSchema,
} from "../validation/sellRequestValidation";

const router = Router();
const validator = createValidator({});

router.post(
  "/create",
  authMiddleware,
  validator.body(createSellRequestSchema),
  createSellRequest
);
router.get("/list", optionalAuthMiddleware, listSellRequests);

router.get("/my_list", authMiddleware, listMySellRequests);

router.get(
  "/admin_list",
  checkPermissionMiddleware(PERMISSIONS.SELL_REQUESTS),
  listAdminSellRequests
);

router.get("/:id", showSellRequest);
router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.SELL_REQUESTS),
  deleteSellRequest
);

router.put(
  "/:id",
  authMiddleware,
  validator.body(updateSellRequestSchema),
  updateSellRequest
);

export default router;
