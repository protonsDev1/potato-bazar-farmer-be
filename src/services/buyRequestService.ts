import { Op } from "sequelize";
import BuyRequest, { BUY_REQUEST_STATUS } from "../database/models/buyRequest";
import User, { USER_ROLES } from "../database/models/user";
import { generateBuyRequestId } from "../utils/generate";
import FavouriteRequest from "../database/models/favouriteRequest";
import RequestView from "../database/models/requestView";
import SubAdminPermission from "../database/models/subAdminPermission";
import { PERMISSIONS } from "../utils/constants/permissions";

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
    skinColor: data.skinColor,
    shape: data.shape,
    tpod: data.tpod,
    uc: data.uc,
    tuberSize: data.tuberSize,
    dryMatter: data.dryMatter,
    soilAdherence: data.soilAdherence,
    firmness: data.firmness,
    sproutingStatus: data.sproutingStatus,
    healthCondition: data.healthCondition,
    additionalComment: data.additionalComment,
    storageTemperature: data.storageTemperature,
    brand: data.brand,
    generation: data.generation,
    treatmentStatus: data.treatmentStatus,
    seedSourceType: data.seedSourceType,
    sproutingCondition: data.sproutingCondition,
    physicalCondition: data.physicalCondition,
    roguingStatus: data.roguingStatus,
    perTubeWeight: data.perTubeWeight,
    diseaseFreeCertified: data.diseaseFreeCertified,
    productionMethod: data.productionMethod,
    productionDate: data.productionDate,
    organicCertified: data.organicCertified,
    status: BUY_REQUEST_STATUS.PENDING,
  });

  return newRequest;
};

export const listBuyRequestsService = async (
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
    userId,
    currentBuyRequestId,
  } = query;

  const offset = (Number(page) - 1) * Number(perPage);

  // const where: any = { status: BUY_REQUEST_STATUS.ACTIVE };
  const where: any = { isActive: true };
  const userWhere: any = {};

  if (userId) {
    where.userId = userId;
  } else if (currentUserId) {
    where.userId = { [Op.ne]: currentUserId };
  }

  if (currentBuyRequestId) {
    where.id = { [Op.ne]: currentBuyRequestId };
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

  const { rows, count } = await BuyRequest.findAndCountAll({
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
              as: "buyFavourites",
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
    isFavourite: req.buyFavourites?.length > 0 || false,
  }));

  return {
    page: Number(page),
    perPage: Number(perPage),
    totalPages: Math.ceil(count / Number(perPage)),
    total: count,
    requests: requestsWithFavourite,
  };
};

export const listMyBuyRequestsService = async (
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

  const { rows, count } = await BuyRequest.findAndCountAll({
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
        as: "buyFavourites",
        attributes: ["id"],
        required: false,
        where: { userId: currentUserId },
      },
    ],
    limit: Number(perPage),
    offset,
    order: [["createdAt", "DESC"]],
  });

  const requestsWithCounts = await Promise.all(
    rows.map(async (req: any) => {
      const favCount = await FavouriteRequest.count({
        where: { buyRequestId: req.id },
      });

      const viewCount = await RequestView.count({
        where: { buyRequestId: req.id },
      });

      return {
        ...req.toJSON(),
        isFavourite: req.buyFavourites && req.buyFavourites.length > 0,
        favCount,
        viewCount,
      };
    })
  );

  return {
    page: Number(page),
    perPage: Number(perPage),
    totalPages: Math.ceil(count / Number(perPage)),
    total: count,
    requests: requestsWithCounts,
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
      { potatoVariety: { [Op.iLike]: `%${search}%` } },
      { requestId: { [Op.iLike]: `%${search}%` } },
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

export const getBuyRequestByIdService = async (
  id: number,
  currentUserId: number
) => {
  const request = await BuyRequest.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "mobile", "createdAt"],
      },
      {
        model: RequestView,
        as: "views",
        attributes: ["id", "userId"],
      },
      ...(currentUserId
        ? [
            {
              model: FavouriteRequest,
              as: "buyFavourites",
              attributes: ["id"],
              required: false,
              where: { userId: currentUserId },
            },
          ]
        : []),
    ],
  });

  if (!request) return null;

  if (currentUserId) {
    await RequestView.findOrCreate({
      where: { userId: currentUserId, buyRequestId: id },
      defaults: { userId: currentUserId, buyRequestId: id },
    });
  }

  const jsonReq = request.toJSON();

  const [viewCount, favCount] = await Promise.all([
    RequestView.count({
      where: { buyRequestId: id },
    }),
    FavouriteRequest.count({
      where: { buyRequestId: id },
    }),
  ]);

  return {
    ...jsonReq,
    isFavourite: jsonReq.buyFavourites?.length > 0 || false,
    viewCount,
    favCount,
  };
};

export const deleteBuyRequestService = async (user: any, requestId: number) => {
  const request = await BuyRequest.findByPk(requestId);

  if (!request) {
    return {
      statusCode: 404,
      success: false,
      message: "Buy request not found",
    };
  }

  const canDelete =
    request.userId === user.id || // owner
    user.role === USER_ROLES.SUPER_ADMIN || // super admin
    (user.role === USER_ROLES.SUB_ADMIN &&
      (await SubAdminPermission.findOne({
        where: { userId: user.id, permission: PERMISSIONS.BUY_REQUESTS },
      })));

  if (!canDelete) {
    return {
      statusCode: 403,
      success: false,
      message:
        "Only Super Admin, Sub Admin with permission, or the request owner can delete a buy request.",
    };
  }

  await request.destroy();

  return {
    statusCode: 200,
    success: true,
    message: `Buy request deleted successfully`,
  };
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
