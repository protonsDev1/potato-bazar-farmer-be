import express from "express";
import { createValidator } from "express-joi-validation";

import { authMiddleware, superAdminMiddleware } from "../utils/userAuth";
import {
  broadCastNotification,
  markAsRead,
  myNotificationList,
} from "../controller/notificationController";
import {
  broadcastNotificationSchema,
  markAsReadSchema,
} from "../validation/notificationValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/broadcast",
  superAdminMiddleware,
  validator.body(broadcastNotificationSchema),
  broadCastNotification
);
router.post(
  "mark_as_read",
  authMiddleware,
  validator.body(markAsReadSchema),
  markAsRead
);

router.get("/my_notifications", authMiddleware, myNotificationList);
