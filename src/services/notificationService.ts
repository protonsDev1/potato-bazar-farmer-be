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
import { formatDate } from "../utils/dateFormat";

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
  broadcastId?: number;
  audience?: { all?: boolean; userTypes?: string[] };
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
    broadcastId,
    audience,
  } = payload;

  let userIds: number[] = [];

  if (isBroadCast) {
    // if audience.all === true OR audience is omitted -> send to all onboarded mobile users
    if (!audience || audience.all === true) {
      const users = await User.findAll({
        where: {
          [Op.and]: [
            { isUserOnBoardedOnMobile: true },
            { hasStartedUsingMobile: true },
          ],
        },
        attributes: ["id"],
        raw: true,
      });
      userIds = users.map((u) => u.id);
    } else if (
      Array.isArray(audience.userTypes) &&
      audience.userTypes.length > 0
    ) {
      const users = await User.findAll({
        where: {
          // role: USER_ROLES.USER,
          [Op.and]: [
            { isUserOnBoardedOnMobile: true },
            { hasStartedUsingMobile: true },
            { userType: { [Op.overlap]: audience.userTypes } },
          ],
        },
        attributes: ["id"],
        raw: true,
      });
      userIds = users.map((u) => u.id);
    } else {
      // audience present but empty userTypes -> nothing to send
      userIds = [];
    }
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
    broadcastId: broadcastId || null,
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
        data: { referenceType, referenceId, isMatchingCase },
      });
    } catch (err) {
      console.error("sendPushNotification error:", err);
    }
  }

  return {
    success: true,
  };
};

export const sendMandiNotificationToFarmers = async (
  senderId,
  mandiPriceData,
  mandiDetail
) => {
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
      title: `New Mandi Price Data Added for ${mandiDetail.mandiName}, ${mandiDetail.city.name}`,
      description: `New mandi price data for ${mandiDetail.mandiName} in ${
        mandiDetail.city.name
      } has been added for ${formatDate(mandiPriceData.date)}.`,
      senderId,
      referenceType: NotificationType.MANDI_PRICE,
      referenceId: mandiPriceData.id,
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
      title: `New Cold Storage Registered - ${coldStorage.name}`,
      description: `A new cold storage named "${coldStorage.name}" has been registered. Please review and verify its details.`,
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
    .filter((b) => b.userId !== sellRequest.userId)
    .map((f) => f.userId)
    .filter((id): id is number => Boolean(id));

  if (userIds.length === 0) return;

  await sendNotificationService({
    title: "New Matching Sell Request Available.",
    description: `A new sell request (ID: ${sellRequest.requestId}) matching your buy request has been posted. Details: ${sellRequest.quantity} ${sellRequest.unit} of ${sellRequest.potatoVariety} potatoes (Type: ${sellRequest.potatoType}).`,
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
    .filter((s) => s.userId !== buyRequest.userId)
    .map((f) => f.userId)
    .filter((id): id is number => Boolean(id));

  if (userIds.length === 0) return;

  await sendNotificationService({
    title: "New Matching Buy Request Available.",
    description: `A new buy request (ID: ${buyRequest.requestId}) matching your selling items has been posted. Details: ${buyRequest.quantity} ${buyRequest.unit} of ${buyRequest.potatoVariety} potatoes (Type: ${buyRequest.potatoType}).`,
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
