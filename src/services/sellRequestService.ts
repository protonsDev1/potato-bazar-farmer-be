import { Op } from "sequelize";
import User from "../database/models/user";
import { generateSellRequestId } from "../utils/generate";
import SellRequest, {
  SELL_REQUEST_STATUS,
} from "../database/models/sellRequest";
import FavouriteRequest from "../database/models/favouriteRequest";

export const createSellRequestService = async (userId: number, data: any) => {
  const newRequest = await SellRequest.create({
    userId,
    requestId: generateSellRequestId(),
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
    status: SELL_REQUEST_STATUS.AVAILABLE,
  });

  return newRequest;
};

export const listSellRequestsService = async (
  query: any,
  currentUserId: number
) => {
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

  const where: any = { status: SELL_REQUEST_STATUS.AVAILABLE };
  const userWhere: any = {};

  if (currentUserId) {
    where.userId = { [Op.ne]: currentUserId };
  }

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

  const { rows, count } = await SellRequest.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "mobile", "state", "district"],
        where: Object.keys(userWhere).length ? userWhere : undefined,
      },
      ...(currentUserId
        ? [
            {
              model: FavouriteRequest,
              as: "sellFavourites",
              attributes: ["id"],
              required: false,
              where: { userId: currentUserId },
            },
          ]
        : []),
    ],
    limit: Number(perPage),
    offset,
    order: [["createdAt", "DESC"]],
  });

  const requestsWithFavourite = rows.map((req: any) => ({
    ...req.toJSON(),
    isFavourite: req.sellFavourites?.length > 0 || false,
  }));

  return {
    page: Number(page),
    perPage: Number(perPage),
    totalPages: Math.ceil(count / Number(perPage)),
    total: count,
    requests: requestsWithFavourite,
  };
};

export const listMySellRequestsService = async (
  currentUserId: number,
  query: any
) => {
  const {
    page = 1,
    perPage = 10,
    potatoType,
    potatoVariety,
    qualityGrade,
    district,
  } = query;

  const offset = (Number(page) - 1) * Number(perPage);

  const where: any = { userId: currentUserId };
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

  const { rows, count } = await SellRequest.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "mobile", "state", "district"],
        where: Object.keys(userWhere).length ? userWhere : undefined,
      },
      {
        model: FavouriteRequest,
        as: "sellFavourites",
        attributes: ["id"],
        required: false,
        where: { userId: currentUserId },
      },
    ],
    limit: Number(perPage),
    offset,
    order: [["createdAt", "DESC"]],
  });

  const requestsWithFavourite = rows.map((req: any) => ({
    ...req.toJSON(),
    isFavourite: req.sellFavourites && req.sellFavourites.length > 0,
  }));

  return {
    page: Number(page),
    perPage: Number(perPage),
    totalPages: Math.ceil(count / Number(perPage)),
    total: count,
    requests: requestsWithFavourite,
  };
};

export const listAdminSellRequestsService = async (query: any) => {
  const { page = 1, perPage = 10, status, search } = query;
  const offset = (Number(page) - 1) * Number(perPage);

  const where: any = {};
  if (status) where.status = status;

  if (search) {
    where[Op.or] = [
      { potatoType: { [Op.iLike]: `%${search}%` } },
      { potatoVariety: { [Op.iLike]: `%${search}%` } },
      { requestId: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows, count } = await SellRequest.findAndCountAll({
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

  const [totalRequests, availableCount, reservedCount, soldCount] =
    await Promise.all([
      SellRequest.count(),
      SellRequest.count({ where: { status: SELL_REQUEST_STATUS.AVAILABLE } }),
      SellRequest.count({ where: { status: SELL_REQUEST_STATUS.RESERVED } }),
      SellRequest.count({ where: { status: SELL_REQUEST_STATUS.SOLD } }),
    ]);

  return {
    page: Number(page),
    perPage: Number(perPage),
    totalPages: Math.ceil(count / Number(perPage)),
    total: count,
    totalRequests,
    availableCount,
    reservedCount,
    soldCount,
    requests: rows,
  };
};

export const getSellRequestByIdService = async (
  id: number,
  currentUserId: number
) => {
  const request = await SellRequest.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "mobile"],
      },
      ...(currentUserId
        ? [
            {
              model: FavouriteRequest,
              as: "sellFavourites",
              attributes: ["id"],
              required: false,
              where: { userId: currentUserId },
            },
          ]
        : []),
    ],
  });
  if (!request) return null;

  return {
    ...request.toJSON(),
    isFavourite: request.sellFavourites?.length > 0 || false,
  };
};

export const deleteSellRequestService = async (id: number) => {
  const request = await SellRequest.findOne({ where: { id } });

  if (!request) return false;

  await request.destroy();
  return true;
};

export const updateSellRequestService = async (
  userId: number,
  requestId: number,
  payload: any
) => {
  const request = await SellRequest.findByPk(requestId);

  if (!request) {
    return {
      statusCode: 404,
      success: false,
      message: "Sell request not found",
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
    message: "Sell request updated successfully",
    data: request,
  };
};
