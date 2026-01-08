import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";
import {
  createOpenMarketPlace,
  deleteOpenMarketPlace,
  getOpenMarketPlaceById,
  getOpenMarketPlacesListing,
  updateStatusForOpenMarketPlace,
} from "../controller/openMarketPlaceController";
import {
  createOpenMarketSchema,
  updateStatusSchema,
} from "../validation/openMarketPlaceValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(createOpenMarketSchema),
  createOpenMarketPlace
);
router.get("/", authMiddleware, getOpenMarketPlacesListing);
router.get("/:id", authMiddleware, getOpenMarketPlaceById);
router.put(
  "/status",
  checkPermissionMiddleware(PERMISSIONS.OPEN_MARKET_PLACE),
  validator.body(updateStatusSchema),
  updateStatusForOpenMarketPlace
);
router.delete("/:id", authMiddleware, deleteOpenMarketPlace);

export default router;
