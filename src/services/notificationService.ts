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

interface Payload {
  title: string;
  description: string;
  senderId: number;
  receiverId?: number;
  referenceType: string;
  referenceId?: number;
  receiverIds?: number[];
  isBroadCast?: boolean;
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
  } = payload;

  let userIds: number[] = [];

  if (isBroadCast) {
    const users = await User.findAll({
      where: {
        role: USER_ROLES.USER,
        [Op.and]: [
          {
            isUserOnBoardedOnMobile: true,
          },
          {
            hasStartedUsingMobile: true,
          },
        ],
      },
    });

    const notifications = users.map((user) => ({
      title,
      description,
      senderId,
      receiverId: user.id,
      referenceType,
      referenceId,
    }));

    await Notification.bulkCreate(notifications);
    userIds = users.map((u) => u.id);
  } else if (Array.isArray(receiverIds) && receiverIds.length > 0) {
    const notifications = receiverIds.map((id) => ({
      title,
      description,
      senderId,
      receiverId: id,
      referenceType,
      referenceId,
    }));
    await Notification.bulkCreate(notifications);
    userIds = receiverIds;
  } else if (receiverId) {
    await Notification.create({
      title,
      description,
      senderId,
      receiverId,
      referenceType,
      referenceId,
    });
    userIds = [receiverId];
  }

  if (userIds.length > 0) {
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ["playerId"],
    });

    const playerIds = users.map((u) => u.playerId).filter(Boolean);

    if (playerIds.length > 0) {
      await sendPushNotification({
        title,
        message: description,
        playerIds,
        data: { referenceType, referenceId },
      });
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
  });
};
