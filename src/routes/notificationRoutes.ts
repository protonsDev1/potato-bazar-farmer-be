import express from "express";
import { createValidator } from "express-joi-validation";

import { authMiddleware, superAdminMiddleware } from "../utils/userAuth";
import {
  broadCastNotification,
  deleteNotification,
  getNotificationSettings,
  markAsRead,
  myNotificationList,
  unreadNotificationCount,
  updateNotificationSettings,
} from "../controller/notificationController";
import {
  broadcastNotificationSchema,
  deleteNotificationSchema,
  markAsReadSchema,
  updateNotificationSettingsSchema,
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
  "/mark_as_read",
  authMiddleware,
  validator.body(markAsReadSchema),
  markAsRead
);

router.get("/", authMiddleware, myNotificationList);

router.get("/unread_count", authMiddleware, unreadNotificationCount);

router.delete(
  "/",
  authMiddleware,
  validator.body(deleteNotificationSchema),
  deleteNotification
);

router.get("/settings", authMiddleware, getNotificationSettings);

router.put(
  "/settings",
  authMiddleware,
  validator.body(updateNotificationSettingsSchema),
  updateNotificationSettings
);

export default router;
