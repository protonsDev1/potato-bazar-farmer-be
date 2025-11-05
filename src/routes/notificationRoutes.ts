import express from "express";
import { createValidator } from "express-joi-validation";

import { authMiddleware, superAdminMiddleware } from "../utils/userAuth";
import {
  broadCastNotification,
  deleteNotification,
  markAsRead,
  myNotificationList,
} from "../controller/notificationController";
import {
  broadcastNotificationSchema,
  deleteNotificationSchema,
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
  "/mark_as_read",
  authMiddleware,
  validator.body(markAsReadSchema),
  markAsRead
);

router.get("/", authMiddleware, myNotificationList);
router.delete(
  "/",
  authMiddleware,
  validator.body(deleteNotificationSchema),
  deleteNotification
);

export default router;
