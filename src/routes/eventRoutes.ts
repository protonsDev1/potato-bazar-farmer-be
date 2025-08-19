import express from "express";
import { createValidator } from "express-joi-validation";

import {
  createEvent,
  deleteEvent,
  retrieveAllEvents,
  retrieveEventDetail,
  updateEvent,
  updateEventStatus,
} from "../controller/eventController";
import {
  createEventSchema,
  updateEventSchema,
  updateEventStatusSchema,
} from "../validation/eventValidation";
import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(createEventSchema),
  createEvent
);
router.get(
  "/",
  checkPermissionMiddleware(PERMISSIONS.EVENTS),
  retrieveAllEvents
);
router.get(
  "/:eventId",
  checkPermissionMiddleware(PERMISSIONS.EVENTS),
  retrieveEventDetail
);
router.put(
  "/:eventId",
  authMiddleware,
  validator.body(updateEventSchema),
  updateEvent
);
router.delete(
  "/:eventId",
  checkPermissionMiddleware(PERMISSIONS.EVENTS),
  deleteEvent
);
router.put(
  "/update_status/:eventId",
  checkPermissionMiddleware(PERMISSIONS.EVENTS),
  validator.body(updateEventStatusSchema),
  updateEventStatus
);

export default router;
