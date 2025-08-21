import { Op } from "sequelize";
import BuyRequest, { BUY_REQUEST_STATUS } from "../database/models/buyRequest";
import User from "../database/models/user";
import { generateBuyRequestId } from "../utils/generate";

export const createBuyRequestService = async (userId: number, data: any) => {
  const newRequest = await BuyRequest.create({
    userId,
    requestId: generateBuyRequestId(),
    potatoType: data.potatoType,
    potatoVariety: data.potatoVariety,
    quantity: data.quantity,
    unit: data.unit,
    targetPrice: data.targetPrice,
    requiredByDate: data.requiredByDate,
    qualityGrade: data.qualityGrade,
    packagingType: data.packagingType,
    delivery: data.delivery,
    size: data.size,
    sugarContent: data.sugarContent,
    skinSet: data.skinSet,
    fleshColor: data.fleshColor,
    shape: data.shape,
    soilAdherence: data.soilAdherence,
    firmness: data.firmness,
    sproutingStatus: data.sproutingStatus,
    organicCerified: data.organicCerified,
    status: BUY_REQUEST_STATUS.PENDING,
  });

  return newRequest;
};

export const listBuyRequestsService = async (query: any) => {
  const {
    page = 1,
    perPage = 10,
    potatoType,
    potatoVariety,
    qualityGrade,
    district,
    isVerified,
  } = query;

  const offset = (Number(page) - 1) * Number(perPage);

  const where: any = { status: BUY_REQUEST_STATUS.ACTIVE };
  const userWhere: any = {};

  if (potatoType) {
    where.potatoType = potatoType;
  }

  if (potatoVariety && potatoVariety !== "all") {
    where.potatoVariety = potatoVariety;
  }

  if (qualityGrade) {
    where.qualityGrade = qualityGrade;
  }

  if (isVerified && isVerified === "true") {
    where.isVerified = true;
  }

  if (district) {
    userWhere.district = district;
  }

  const { rows, count } = await BuyRequest.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "mobile", "state", "district"],
        where: Object.keys(userWhere).length ? userWhere : undefined,
      },
    ],
    limit: Number(perPage),
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    page: Number(page),
    perPage: Number(perPage),
    totalPages: Math.ceil(count / Number(perPage)),
    total: count,
    requests: rows,
  };
};

export const listMyBuyRequestsService = async (userId: number, query: any) => {
  const {
    page = 1,
    perPage = 10,
    potatoType,
    potatoVariety,
    qualityGrade,
    district,
  } = query;

  const offset = (Number(page) - 1) * Number(perPage);

  const where: any = { userId };
  const userWhere: any = {};

  if (potatoType) {
    where.potatoType = potatoType;
  }

  if (potatoVariety && potatoVariety !== "all") {
    where.potatoVariety = potatoVariety;
  }

  if (qualityGrade) {
    where.qualityGrade = qualityGrade;
  }

  if (district) {
    userWhere.district = district;
  }

  const { rows, count } = await BuyRequest.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "mobile", "state", "district"],
        where: Object.keys(userWhere).length ? userWhere : undefined,
      },
    ],
    limit: Number(perPage),
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    page: Number(page),
    perPage: Number(perPage),
    totalPages: Math.ceil(count / Number(perPage)),
    total: count,
    requests: rows,
  };
};

export const listAdminBuyRequestsService = async (query: any) => {
  const { page = 1, perPage = 10, status, search } = query;
  const offset = (Number(page) - 1) * Number(perPage);

  const where: any = {};
  if (status) where.status = status;

  if (search) {
    where[Op.or] = [
      { potatoType: { [Op.iLike]: `%${search}%` } },
      { tapotatoVariety: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows, count } = await BuyRequest.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "mobile"],
      },
    ],
    limit: Number(perPage),
    offset,
    order: [["createdAt", "DESC"]],
  });

  const [totalRequests, activeCount, pendingCount, completedCount] =
    await Promise.all([
      BuyRequest.count(),
      BuyRequest.count({ where: { status: BUY_REQUEST_STATUS.ACTIVE } }),
      BuyRequest.count({ where: { status: BUY_REQUEST_STATUS.PENDING } }),
      BuyRequest.count({ where: { status: BUY_REQUEST_STATUS.COMPLETED } }),
    ]);

  return {
    page: Number(page),
    perPage: Number(perPage),
    totalPages: Math.ceil(count / Number(perPage)),
    total: count,
    totalRequests,
    activeCount,
    pendingCount,
    completedCount,
    requests: rows,
  };
};

export const getBuyRequestByIdService = async (id: number) => {
  return await BuyRequest.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "mobile"],
      },
    ],
  });
};

export const deleteBuyRequestService = async (id: number) => {
  const request = await BuyRequest.findOne({ where: { id } });

  if (!request) return false;

  await request.destroy();
  return true;
};

export const updateBuyRequestService = async (
  userId: number,
  requestId: number,
  payload: any
) => {
  const request = await BuyRequest.findByPk(requestId);

  if (!request) {
    return {
      statusCode: 404,
      success: false,
      message: "Buy request not found",
    };
  }

  if (request.userId !== userId) {
    return {
      statusCode: 403,
      success: false,
      message: "You are not allowed to update this request",
    };
  }

  await request.update(payload);

  return {
    statusCode: 200,
    success: true,
    message: "Buy request updated successfully",
    data: request,
  };
};
