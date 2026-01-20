import { Op, Sequelize } from "sequelize";
import TransportService, {
  TRANSPORT_SERVICE_STATUS,
} from "../database/models/transportService";

export const createTransport = async (payload) => {
  const transportService = await TransportService.create(payload);

  return {
    data: transportService,
  };
};

export const getTransportService = async (userId, page, limit, listingType) => {
  const offset = (page - 1) * limit;

  const whereCondition: any = {};

  if (listingType === "own") {
    whereCondition.createdBy = userId;
  } else if (listingType === "others") {
    whereCondition.status = TRANSPORT_SERVICE_STATUS.APPROVED;
    whereCondition.isActive = true;
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

  const { rows, count } = await TransportService.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    distinct: true,
    order: [["createdAt", "DESC"]],
  });

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
    transportServices: rows,
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

  await record.update(payload);

  return {
    success: true,
    data: record,
  };
};
