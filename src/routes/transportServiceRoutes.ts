import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";

import {
  availabilitySchema,
  createTransportServiceSchema,
  updateStatusSchema,
  updateTransportServiceSchema,
} from "../validation/transportServiceValidation";
import {
  createTransportService,
  deleteTransportService,
  getTransportServiceById,
  getTransportServiceListing,
  likeOrDislikeTransportService,
  updateStatusForTransportService,
  updateTransportService,
  updateTransportServiceAvailability,
} from "../controller/transportController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(createTransportServiceSchema),
  createTransportService,
);
router.post("/toggle-like/:id", authMiddleware, likeOrDislikeTransportService);
router.get("/", authMiddleware, getTransportServiceListing);
router.get("/:id", authMiddleware, getTransportServiceById);
router.put(
  "/status",
  checkPermissionMiddleware(PERMISSIONS.TRANSPORT_SERVICE),
  validator.body(updateStatusSchema),
  updateStatusForTransportService,
);
router.put(
  "/:id",
  authMiddleware,
  validator.body(updateTransportServiceSchema),
  updateTransportService,
);
router.delete("/:id", authMiddleware, deleteTransportService);

router.patch(
  "/:transportId/availability",
  authMiddleware,
  validator.body(availabilitySchema),
  updateTransportServiceAvailability,
);

export default router;
