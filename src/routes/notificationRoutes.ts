import express from "express";
import { createValidator } from "express-joi-validation";

import {
  authMiddleware,
  checkPermissionMiddleware,
  superAdminMiddleware,
} from "../utils/userAuth";
import {
  broadCastNotification,
  broadcastNotificationList,
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
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.get(
  "/broadcast",
  checkPermissionMiddleware(PERMISSIONS.BROADCAST),
  broadcastNotificationList
);

router.post(
  "/broadcast",
  checkPermissionMiddleware(PERMISSIONS.BROADCAST),
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
