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
  updateEventSchema,
  updateEventStatusSchema,
} from "../validation/eventValidation";
import { authMiddleware, superAdminMiddleware } from "../utils/userAuth";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  superAdminMiddleware,
  validator.body(createEventSchema),
  createEvent
);
router.get("/", retrieveAllEvents);
router.get("/event_requests", retrieveAllEventRequests);
router.get("/:eventId", retrieveEventDetail);
router.put(
  "/:eventId",
  superAdminMiddleware,
  validator.body(updateEventSchema),
  updateEvent
);
router.delete("/:eventId", superAdminMiddleware, deleteEvent);

router.post("/join_event/:eventId", authMiddleware, registerOnEvent);

router.put(
  "/update_status/:requestId",
  superAdminMiddleware,
  validator.body(updateEventStatusSchema),
  updateEventStatus
);

export default router;
