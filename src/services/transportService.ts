import { Op, Sequelize } from "sequelize";
import { TRANSPORT_SERVICE_STATUS } from "../database/models/transportRequirement";
import TransportService from "../database/models/transportService";
import User, { USER_ROLES } from "../database/models/user";
import { sendNotificationService } from "./notificationService";
import { NotificationType } from "../database/models/notification";
import LikeTransportService from "../database/models/likeTransportService";
import TransportServiceView from "../database/models/transportServiceView";

export const createTransport = async (payload) => {
  const transportService = await TransportService.create(payload);

  return {
    data: transportService,
  };
};

export const getTransportService = async (
  userId,
  page,
  limit,
  listingType,
  pbVerified,
  status,
  transporterType,
  rateType,
  vehicleType,
  routeCoverage,
  isFavourite,
  search,
) => {
  const offset = (page - 1) * limit;

  const userWhere: any = {};
  const whereCondition: any = {};

  if (listingType === "own") {
    whereCondition.createdBy = userId;
  } else if (listingType === "others") {
    whereCondition.status = TRANSPORT_SERVICE_STATUS.APPROVED;
    whereCondition.isActive = true;
    userWhere.isActive = true;
    userWhere.isDeleted = false;
  }

  const userInclude: any = {
    model: User,
    as: "creator",
    // attributes: [
    //   "id",
    //   "name",
    //   "role",
    //   "email",
    //   "mobile",
    //   "pbVerified",
    //   "isActive",
    //   "isDeleted",
    //   "createdAt",
    //   "updatedAt",
    // ],
    where: userWhere,
  };

  if (pbVerified && pbVerified.toLowerCase() !== "all") {
    userInclude.where = { pbVerified: pbVerified === "true" };
    userInclude.required = true;
  }

  if (status) {
    whereCondition.status = status;
  }

  if (transporterType) {
    whereCondition.transporterType = transporterType;
  }

  // if (rateType) {
  //   whereCondition.rateType = rateType;
  // }

  if (rateType) {
    whereCondition.rateType = {
      [Op.contains]: Array.isArray(rateType) ? rateType : [rateType],
    };
  }

  if (vehicleType) {
    whereCondition.vehicleTypeRequired = {
      [Op.contains]: [vehicleType],
    };
  }

  if (routeCoverage) {
    whereCondition.routeCoverage = {
      [Op.contains]: [routeCoverage],
    };
  }

  const totalTransportServices = await TransportService.count();
  const totalApprovedTransportServices = await TransportService.count({
    where: { status: TRANSPORT_SERVICE_STATUS.APPROVED },
  });
  const totalRejectedTransportServices = await TransportService.count({
    where: { status: TRANSPORT_SERVICE_STATUS.REJECTED },
  });
  const totalPendingTransportServices = await TransportService.count({
    where: { status: TRANSPORT_SERVICE_STATUS.PENDING },
  });

  if (search && search.trim() !== "") {
    const searchTerm = `%${search.trim()}%`;

    whereCondition[Op.or] = [
      { transporterType: { [Op.iLike]: searchTerm } },
      { ownerOrCompanyName: { [Op.iLike]: searchTerm } },
    ];

    if (!isNaN(Number(search))) {
      whereCondition[Op.or].push({
        noOfVehicles: Number(search),
      });
    }
  }

  let favouriteIds: number[] = [];

  if (isFavourite === "true") {
    const likedRecords = await LikeTransportService.findAll({
      where: { userId },
      attributes: ["serviceId"],
    });

    favouriteIds = likedRecords.map((like) => like.serviceId);

    if (favouriteIds.length === 0) {
      return {
        currentPage: page,
        total: 0,
        totalPages: 0,
        transportServices: [],
      };
    }

    whereCondition.id = { [Op.in]: favouriteIds };
  }

  const { rows, count } = await TransportService.findAndCountAll({
    where: whereCondition,
    include: [userInclude],
    limit,
    offset,
    distinct: true,
    order: [["createdAt", "DESC"]],
  });

  const enrichedRows = await Promise.all(
    rows.map(async (service) => {
      const [viewCount, likeCount, likedRecord] = await Promise.all([
        TransportServiceView.count({
          where: { serviceId: service.id },
        }),
        LikeTransportService.count({
          where: { serviceId: service.id },
        }),
        LikeTransportService.findOne({
          where: { serviceId: service.id, userId },
        }),
      ]);

      return {
        ...service.toJSON(),
        viewCount,
        likeCount,
        isLiked: !!likedRecord,
      };
    }),
  );

  return {
    dashStats: {
      totalTransportServices,
      totalApprovedTransportServices,
      totalPendingTransportServices,
      totalRejectedTransportServices,
    },
    currentPage: page,
    total: count,
    totalPages: Math.ceil(count / limit),
    transportServices: enrichedRows,
  };
};

export const updateTransport = async (recordId, userId, payload) => {
  const record = await TransportService.findOne({
    where: {
      id: recordId,
      createdBy: userId,
    },
  });

  if (!record)
    return {
      success: false,
      error: "Transport Service record not found.",
      statusCode: 404,
    };

  if (Object.keys(payload).length === 1 && payload.hasOwnProperty("isActive")) {
    await record.update({ isActive: payload.isActive });
    return {
      statusCode: 200,
      success: true,
      message: "Transport Service status updated successfully",
      data: record,
    };
  }
  if (record.status !== TRANSPORT_SERVICE_STATUS.PENDING) {
    payload.status = TRANSPORT_SERVICE_STATUS.PENDING;

    const superAdmin = await User.findOne({
      where: { role: USER_ROLES.SUPER_ADMIN },
    });

    await sendNotificationService({
      title: "Transport Service updated.",
      description:
        "A transport service has been moved to pending, please check it.",
      senderId: userId,
      receiverId: superAdmin.id,
      referenceType: NotificationType.TRANSPORT_SERVICES,
      referenceId: recordId,
    });
  }

  await record.update(payload);

  return {
    success: true,
    data: record,
  };
};
