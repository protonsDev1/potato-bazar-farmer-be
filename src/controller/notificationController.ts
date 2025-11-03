import { literal } from "sequelize";

import Notification, {
  NotificationType,
} from "../database/models/notification";
import { sendNotificationService } from "../services/notificationService";

export const broadCastNotification = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.user;

    await sendNotificationService({
      title,
      description,
      senderId: id,
      referenceType: NotificationType.BROADCAST,
      isBroadCast: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in broadcasting notification",
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId, markAll = false } = req.body;
    const { id: userId } = req.user;

    if (markAll) {
      await Notification.update(
        { isRead: true },
        { where: { receiverId: userId, isRead: false } }
      );
    } else if (notificationId) {
      await Notification.update(
        { isRead: true },
        { where: { id: notificationId, receiverId: userId } }
      );
    }

    return res.status(200).json({
      success: true,
      message: markAll
        ? "All notifications marked as read."
        : "Notification marked as read.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in marking as read notification",
    });
  }
};

export const myNotificationList = async (req, res) => {
  try {
    const { id: userId } = req.user;
    let { page = 1, perPage: limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    const { rows, count } = await Notification.findAndCountAll({
      where: {
        receiverId: userId,
      },
      order: [
        [literal('CASE WHEN "isRead" = false THEN 0 ELSE 1 END'), "ASC"], // unread first
        ["createdAt", "DESC"], // newest on top
      ],
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully.",
      data: {
        notifications: rows,
        currentPage: page,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in fetching my notificaitons ",
    });
  }
};
