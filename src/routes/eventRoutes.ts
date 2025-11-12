import express from "express";
import { createValidator } from "express-joi-validation";

import {
  createEvent,
  deleteEvent,
  registerOnEvent,
  retrieveAllEventRequests,
  retrieveAllEvents,
  retrieveEventDetail,
  updateEvent,
  updateEventStatus,
} from "../controller/eventController";
import {
  createEventSchema,
  registerOnEventSchema,
  updateEventSchema,
  updateEventStatusSchema,
} from "../validation/eventValidation";
import {
  authMiddleware,
  checkPermissionMiddleware,
  optionalAuthMiddleware,
} from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.EVENTS),
  validator.body(createEventSchema),
  createEvent
);
router.get("/", retrieveAllEvents);
router.get("/event_requests", retrieveAllEventRequests);
router.get("/:eventId", optionalAuthMiddleware, retrieveEventDetail);
router.put(
  "/:eventId",
  checkPermissionMiddleware(PERMISSIONS.EVENTS),
  validator.body(updateEventSchema),
  updateEvent
);
router.delete(
  "/:eventId",
  checkPermissionMiddleware(PERMISSIONS.EVENTS),
  deleteEvent
);

router.post(
  "/join_event/:eventId",
  authMiddleware,
  validator.body(registerOnEventSchema),
  registerOnEvent
);

router.put(
  "/update_status/:requestId",
  checkPermissionMiddleware(PERMISSIONS.EVENTS),
  validator.body(updateEventStatusSchema),
  updateEventStatus
);

export default router;
