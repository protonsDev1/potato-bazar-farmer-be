import { Op } from "sequelize";

import Notification, {
  NotificationType,
} from "../database/models/notification";
import { sendNotificationService } from "../services/notificationService";
import UserNotificationSetting from "../database/models/userNotificationSetting";
import User from "../database/models/user";
import Broadcast from "../database/models/broadcast";
import { differenceInMonths, format, formatDistanceToNow } from "date-fns";

export const broadCastNotification = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.user;

    const broadcast = await Broadcast.create({
      title,
      description,
      senderId: id,
    });

    await sendNotificationService({
      title,
      description,
      senderId: id,
      referenceType: NotificationType.BROADCAST,
      isBroadCast: true,
      broadcastId: broadcast.id,
    });

    return res.status(200).json({
      success: true,
      message: "Broadcast notification sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in broadcasting notification",
    });
  }
};

export const broadcastNotificationList = async (req, res) => {
  try {
    let { page = 1, perPage: limit = 10, search, senderId } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (senderId) {
      where.senderId = Number(senderId);
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await Broadcast.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Broadcast notifications fetched successfully.",
      data: {
        currentPage: page,
        total: count,
        totalPages: Math.ceil(count / limit),
        notifications: rows,
      },
    });
  } catch (error) {
    console.error("broadcastNotificationList error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error in fetching broadcast notifications",
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
      const isValidId = await Notification.findOne({
        where: {
          receiverId: userId,
          id: notificationId,
        },
      });

      if (!isValidId)
        return res
          .status(400)
          .json({ success: false, message: "Invalid notification id." });

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
    let { page = 1, perPage: limit = 10, isRead } = req.query;

    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;
    const where: any = { receiverId: userId };

    if (isRead !== undefined) {
      where.isRead = isRead === "true";
    }

    const { rows, count } = await Notification.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]], // newest on top
      limit,
      offset,
    });

    const notifications = rows.map((u) => {
      const createdAt = new Date(u.createdAt);

      const monthsDiff = differenceInMonths(new Date(), createdAt);

      let formattedTime;

      if (monthsDiff < 1) {
        formattedTime = formatDistanceToNow(createdAt, { addSuffix: true });
      } else {
        formattedTime = format(createdAt, "dd MMM yyyy, hh:mm a");
      }

      return {
        ...u.toJSON(),
        timeAgo: formattedTime,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully.",
      data: {
        notifications,
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

export const unreadNotificationCount = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const unreadCount = await Notification.count({
      where: { receiverId: userId, isRead: false },
    });

    return res.status(200).json({
      success: true,
      message: "Unread Notifications count",
      count: unreadCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in fetching unread notification count ",
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { deleteAll = false, notificationIds } = req.body;
    const { id: userId } = req.user;

    let deletedCount = 0;

    if (deleteAll) {
      deletedCount = await Notification.destroy({
        where: { receiverId: userId },
      });
    } else {
      if (!notificationIds) {
        return res.status(400).json({
          success: false,
          message: "notificationIds are required when deleteAll is false.",
        });
      }

      const userNotifications = await Notification.findAll({
        where: {
          receiverId: userId,
          id: { [Op.in]: notificationIds },
        },
        attributes: ["id"],
      });

      if (userNotifications.length !== notificationIds.length) {
        return res.status(400).json({
          success: false,
          message:
            "Some notifications do not belong to the user or are invalid. No notifications were deleted.",
        });
      }

      deletedCount = await Notification.destroy({
        where: {
          receiverId: userId,
          id: { [Op.in]: notificationIds },
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: deleteAll
        ? `All notifications deleted successfully.`
        : `${deletedCount} notification(s) deleted successfully.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in fetching my notificaitons ",
    });
  }
};

export const getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    let settings = await UserNotificationSetting.findOne({ where: { userId } });
    if (!settings) {
      settings = await UserNotificationSetting.create({ userId });
    }
    return res.json({ success: true, data: settings });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const payload = req.body;

    let settings = await UserNotificationSetting.findOne({ where: { userId } });
    if (payload.allowAll === true) {
      payload.buy = true;
      payload.sell = true;
      payload.mandiPrice = true;
      payload.broadcast = true;
      payload.news = true;
      payload.event = true;
      payload.govScheme = true;
      payload.coldStorage = true;
      payload.knowledgeHub = true;
    }

    if (!settings) {
      settings = await UserNotificationSetting.create({ userId, ...payload });
    } else {
      await settings.update(payload);
    }

    return res.json({ success: true, data: settings });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
