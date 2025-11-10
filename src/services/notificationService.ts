import { Op } from "sequelize";
import Notification, {
  NotificationType,
} from "../database/models/notification";
import User, { REGISTRATION_STATUS, USER_ROLES } from "../database/models/user";
import Farmer from "../database/models/farmer";
import ColdStorage from "../database/models/coldStorage";
import BuyRequest from "../database/models/buyRequest";
import SellRequest from "../database/models/sellRequest";
import { sendPushNotification } from "../utils/sendPushNotification";
import UserNotificationSetting from "../database/models/userNotificationSetting";

interface Payload {
  title: string;
  description: string;
  senderId: number;
  receiverId?: number;
  referenceType: string;
  referenceId?: number;
  receiverIds?: number[];
  isBroadCast?: boolean;
  isMatchingCase?: boolean;
}

export const sendNotificationService = async (payload: Payload) => {
  const {
    title,
    description,
    senderId,
    receiverId,
    referenceType,
    referenceId,
    receiverIds,
    isBroadCast = false,
    isMatchingCase = false,
  } = payload;

  let userIds: number[] = [];

  if (isBroadCast) {
    const users = await User.findAll({
      where: {
        role: USER_ROLES.USER,
        [Op.and]: [
          { isUserOnBoardedOnMobile: true },
          { hasStartedUsingMobile: true },
        ],
      },
      attributes: ["id"],
      raw: true,
    });
    userIds = users.map((user) => user.id);
  } else if (Array.isArray(receiverIds) && receiverIds.length > 0) {
    userIds = receiverIds;
  } else if (receiverId) {
    userIds = [receiverId];
  }

  if (!userIds || userIds.length === 0) return { success: true };

  const notifications = userIds.map((id) => ({
    title,
    description,
    senderId,
    receiverId: id,
    referenceType,
    referenceId,
    isMatchingCase,
  }));
  await Notification.bulkCreate(notifications);

  const field = notificationTypeToField(referenceType);

  const users = await User.findAll({
    where: { id: { [Op.in]: userIds } },
    attributes: ["id", "playerId"],
    raw: false,
  });

  const settings = await UserNotificationSetting.findAll({
    where: { userId: { [Op.in]: userIds } },
    attributes: [
      "userId",
      "allowAll",
      "buy",
      "sell",
      "mandiPrice",
      "broadcast",
      "news",
      "event",
      "govScheme",
      "coldStorage",
    ],
    raw: true,
  });

  const settingsMap = new Map<number, any>();
  settings.forEach((s: any) => settingsMap.set(s.userId, s));

  const playerIdsToSend: string[] = [];

  for (const user of users) {
    const userId = user.id;
    const playerId = user.playerId;
    if (!playerId) continue;

    // If this notification type has NO mapping then always push
    if (field === null) {
      playerIdsToSend.push(playerId);
      continue;
    }

    const userSetting = settingsMap.get(userId);

    const allowAll = userSetting ? userSetting.allowAll : true;

    let allowed: boolean;
    if (allowAll) {
      allowed = true;
    } else {
      allowed = !!userSetting?.[field];
    }

    if (allowed) playerIdsToSend.push(playerId);
  }

  if (playerIdsToSend.length > 0) {
    try {
      await sendPushNotification({
        title,
        message: description,
        playerIds: playerIdsToSend,
        data: { referenceType, referenceId },
      });
    } catch (err) {
      console.error("sendPushNotification error:", err);
    }
  }

  return {
    success: true,
  };
};

export const sendMandiNotificationToFarmers = async (senderId, referenceId) => {
  const farmers = await Farmer.findAll({
    where: { status: REGISTRATION_STATUS.APPROVED },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id"],
        where: {
          [Op.and]: [
            {
              isUserOnBoardedOnMobile: true,
            },
            {
              hasStartedUsingMobile: true,
            },
          ],
        },
      },
    ],
  });

  const userIds = farmers
    .map((f) => f.user?.id)
    .filter((id): id is number => Boolean(id));

  if (Array.isArray(userIds) && userIds.length > 0) {
    await sendNotificationService({
      title: "New Mandi Price data is added.",
      description: "New Mandi Price data is added",
      senderId,
      referenceType: NotificationType.MANDI_PRICE,
      referenceId,
      receiverIds: userIds,
    });
  }
};

export const sendNotificationForColdStorage = async (senderId, referenceId) => {
  const coldStorage = await ColdStorage.findOne({
    where: { id: referenceId },
    include: [
      {
        model: User,
        as: "user",
        where: {
          [Op.and]: [
            {
              isUserOnBoardedOnMobile: true,
            },
            {
              hasStartedUsingMobile: true,
            },
          ],
        },
      },
    ],
  });

  if (coldStorage) {
    const superAdmin = await User.findOne({
      where: { role: USER_ROLES.SUPER_ADMIN },
    });

    await sendNotificationService({
      title: "New ColdStorage is added.",
      description: "New ColdStorage is added.",
      senderId,
      referenceType: NotificationType.COLD_STORAGE,
      referenceId,
      receiverId: superAdmin.id,
    });
  }
};

export const sendNotificationToMatchingBuyers = async (
  senderId,
  referenceId
) => {
  const sellRequest = await SellRequest.findByPk(referenceId);

  const buyers = await BuyRequest.findAll({
    where: {
      potatoType: sellRequest.potatoType,
      potatoVariety: sellRequest.potatoVariety,
    },
  });

  const userIds = buyers
    .map((f) => f.userId)
    .filter((id): id is number => Boolean(id));

  await sendNotificationService({
    title: "Matching Sell Request is added.",
    description: "Matching Sell Request is added.",
    senderId,
    referenceType: NotificationType.SELL,
    referenceId,
    receiverIds: userIds,
    isMatchingCase: true,
  });
};

export const sendNotificationToMatchingSellers = async (
  senderId,
  referenceId
) => {
  const buyRequest = await BuyRequest.findByPk(referenceId);

  const sellers = await SellRequest.findAll({
    where: {
      potatoType: buyRequest.potatoType,
      potatoVariety: buyRequest.potatoVariety,
    },
  });

  const userIds = sellers
    .map((f) => f.userId)
    .filter((id): id is number => Boolean(id));

  await sendNotificationService({
    title: "Matching Buy Request is added.",
    description: "Matching Buy Request is added.",
    senderId,
    referenceType: NotificationType.BUY,
    referenceId,
    receiverIds: userIds,
    isMatchingCase: true,
  });
};

export const notificationTypeToField = (type?: string): string | null => {
  if (!type) return null;
  switch (String(type).toUpperCase()) {
    case NotificationType.BUY:
      return "buy";
    case NotificationType.SELL:
      return "sell";
    case NotificationType.MANDI_PRICE:
      return "mandiPrice";
    case NotificationType.BROADCAST:
      return "broadcast";
    case NotificationType.NEWS:
      return "news";
    case NotificationType.EVENT:
      return "event";
    case NotificationType.GOV_SCHEME:
      return "govScheme";
    case NotificationType.COLD_STORAGE:
      return "coldStorage";
    default:
      return null;
  }
};
