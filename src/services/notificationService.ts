import { Op } from "sequelize";
import Notification, {
  NotificationType,
} from "../database/models/notification";
import User, { REGISTRATION_STATUS } from "../database/models/user";
import Farmer from "../database/models/farmer";

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

  if (isBroadCast) {
    const users = await User.findAll({
      where: {
        [Op.or]: [
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
  } else if (receiverId) {
    await Notification.create({
      title,
      description,
      senderId,
      receiverId,
      referenceType,
      referenceId,
    });
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
          [Op.or]: [
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

  await sendNotificationService({
    title: "New Mandi Price data is added.",
    description: "New Mandi Price data is added",
    senderId,
    referenceType: NotificationType.MANDI_PRICE,
    referenceId,
    receiverIds: userIds,
  });
};
