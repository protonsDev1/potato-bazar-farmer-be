import express from "express";
import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import {
  addSellingPlace,
  deleteSellingPlace,
  getActiveSellingPlaces,
  getSellingPlaces,
  updateSellingPlace,
} from "../../../controller/adminController/farmer/sellingPlaceController";
import { createValidator } from "express-joi-validation";
import {
  sellingPlaceCreateSchema,
  sellingPlaceUpdateSchema,
} from "../../../validation/adminValidation";
import { WEB_ACTIONS, WEB_MODULES } from "../../../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(sellingPlaceCreateSchema),
  addSellingPlace
);
router.get("/", getSellingPlaces);
router.get("/active", getActiveSellingPlaces);
router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(sellingPlaceUpdateSchema),
  updateSellingPlace
);
router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteSellingPlace
);

export default router;
