import { Op } from "sequelize";
import User, { USER_ROLES } from "../database/models/user";
import { generateSellRequestId } from "../utils/generate";
import SellRequest, {
  SELL_REQUEST_STATUS,
} from "../database/models/sellRequest";
import FavouriteRequest from "../database/models/favouriteRequest";
import RequestView from "../database/models/requestView";
import SubAdminPermission from "../database/models/subAdminPermission";
import { PERMISSIONS } from "../utils/constants/permissions";

export const createSellRequestService = async (userId: number, data: any) => {
  const newRequest = await SellRequest.create({
    userId,
    requestId: generateSellRequestId(),
    potatoType: data.potatoType,
    potatoVariety: data.potatoVariety,
    quantity: data.quantity,
    unit: data.unit,
    targetPrice: data.targetPrice,
    minOrderQuantity: data.minOrderQuantity,
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
    images: data.images,
    location: data.location,
    status: SELL_REQUEST_STATUS.PENDING,
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
    pbVerified,
    userId,
    currentSellRequestId,
    isFavourite,
  } = query;

  const offset = (Number(page) - 1) * Number(perPage);

  const where: any = { isActive: true, status: SELL_REQUEST_STATUS.APPROVED };
  const userWhere: any = {};

  if (userId) {
    where.userId = userId;
  } else if (currentUserId) {
    where.userId = { [Op.ne]: currentUserId };
  }

  if (currentSellRequestId) {
    where.id = { [Op.ne]: currentSellRequestId };
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

  if (pbVerified && pbVerified.toLowerCase() !== "all") {
    userWhere.pbVerified = pbVerified === "true";
  }

  const include: any[] = [
    {
      model: User,
      as: "user",
      attributes: [
        "id",
        "name",
        "email",
        "mobile",
        "state",
        "district",
        "pbVerified",
      ],
      where: Object.keys(userWhere).length ? userWhere : undefined,
    },
  ];

  if (currentUserId) {
    include.push({
      model: FavouriteRequest,
      as: "sellFavourites",
      attributes: ["id"],
      required: isFavourite === "true",
      where: { userId: currentUserId },
    });
  }

  const { rows, count } = await SellRequest.findAndCountAll({
    where,
    include,
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
        attributes: [
          "id",
          "name",
          "email",
          "mobile",
          "state",
          "district",
          "pbVerified",
        ],
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

  const requestsWithCounts = await Promise.all(
    rows.map(async (req: any) => {
      const favCount = await FavouriteRequest.count({
        where: { sellRequestId: req.id },
      });

      const viewCount = await RequestView.count({
        where: { sellRequestId: req.id },
      });

      return {
        ...req.toJSON(),
        isFavourite: req.sellFavourites && req.sellFavourites.length > 0,
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

export const listAdminSellRequestsService = async (query: any) => {
  const { page = 1, perPage = 10, status, search } = query;
  const offset = (Number(page) - 1) * Number(perPage);

  const where: any = {};

  if (status) {
    if (status.toLowerCase() === "active") {
      where.isActive = true;
    } else if (status.toLowerCase() === "inactive") {
      where.isActive = false;
    } else if (Object.values(SELL_REQUEST_STATUS).includes(status)) {
      where.status = status;
    }
  }

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
        attributes: ["id", "name", "email", "mobile", "pbVerified"],
      },
    ],
    limit: Number(perPage),
    offset,
    order: [["createdAt", "DESC"]],
  });

  const [totalRequests, approvedCount, pendingCount, rejectedCount] =
    await Promise.all([
      SellRequest.count(),
      SellRequest.count({ where: { status: SELL_REQUEST_STATUS.APPROVED } }),
      SellRequest.count({ where: { status: SELL_REQUEST_STATUS.PENDING } }),
      SellRequest.count({ where: { status: SELL_REQUEST_STATUS.REJECTED } }),
    ]);

  return {
    page: Number(page),
    perPage: Number(perPage),
    totalPages: Math.ceil(count / Number(perPage)),
    total: count,
    totalRequests,
    approvedCount,
    pendingCount,
    rejectedCount,
    requests: rows,
  };
};

export const getSellRequestByIdService = async (
  id: number,
  currentUserId: number,
  role: string
) => {
  const include: any = [
    {
      model: RequestView,
      as: "views",
      attributes: ["id", "userId"],
    },
  ];

  if (currentUserId) {
    include.push({
      model: User,
      as: "user",
      attributes: [
        "id",
        "name",
        "email",
        "mobile",
        "createdAt",
        "pbVerified",
        "profilePicture",
      ],
    });

    include.push({
      model: FavouriteRequest,
      as: "sellFavourites",
      attributes: ["id"],
      required: false,
      where: { userId: currentUserId },
    });
  }

  const request = await SellRequest.findOne({
    where: { id },
    include,
  });

  if (!request) return null;

  if (currentUserId && role === USER_ROLES.USER) {
    await RequestView.findOrCreate({
      where: { userId: currentUserId, sellRequestId: id },
      defaults: { userId: currentUserId, sellRequestId: id },
    });
  }

  const jsonReq = request.toJSON();

  const [viewCount, favCount, otherSellRequestsCount] = await Promise.all([
    RequestView.count({
      where: { sellRequestId: id },
    }),
    FavouriteRequest.count({
      where: { sellRequestId: id },
    }),
    SellRequest.count({
      where: {
        userId: request.userId,
        id: { [Op.ne]: id },
        isActive: true,
        status: SELL_REQUEST_STATUS.APPROVED,
      },
    }),
  ]);

  return {
    ...jsonReq,
    isFavourite: jsonReq.sellFavourites?.length > 0 || false,
    viewCount,
    favCount,
    otherSellRequestsCount,
  };
};

export const deleteSellRequestService = async (
  user: any,
  requestId: number
) => {
  const request = await SellRequest.findByPk(requestId);

  if (!request) {
    return {
      statusCode: 404,
      success: false,
      message: "Sell request not found",
    };
  }

  const canDelete =
    request.userId === user.id || // owner
    user.role === USER_ROLES.SUPER_ADMIN || // super admin
    (user.role === USER_ROLES.SUB_ADMIN &&
      (await SubAdminPermission.findOne({
        where: { userId: user.id, permission: PERMISSIONS.SELL_REQUESTS },
      })));

  if (!canDelete) {
    return {
      statusCode: 403,
      success: false,
      message:
        "Only Super Admin, Sub Admin with permission, or the request owner can delete a sell request.",
    };
  }

  await request.destroy();

  return {
    statusCode: 200,
    success: true,
    message: `Sell request deleted successfully`,
  };
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

  if (request.status === SELL_REQUEST_STATUS.APPROVED) {
    return {
      statusCode: 400,
      success: false,
      message: "Approved sell requests cannot be modified",
    };
  }

  if (request.status === SELL_REQUEST_STATUS.REJECTED) {
    payload.status = SELL_REQUEST_STATUS.PENDING;
  }

  await request.update(payload);

  return {
    statusCode: 200,
    success: true,
    message: "Sell request updated successfully",
    data: request,
  };
};

export const updateSellRequestStatusService = async (
  requestId,
  status,
  reason
) => {
  const sellRequest = await SellRequest.findByPk(requestId);

  if (!sellRequest) {
    return null;
  }

  sellRequest.status = status;

  if (status === SELL_REQUEST_STATUS.REJECTED) {
    sellRequest.reason = reason || null;
  } else {
    sellRequest.reason = null;
  }

  await sellRequest.save();

  return sellRequest;
};
