import { Op, Sequelize } from "sequelize";
import OpenMarketPlace, {
  OPEN_MARKET_STATUS,
} from "../database/models/openMarketPlace";
import LikeOpenMarketPlace from "../database/models/likeOpenMarket";
import User, { USER_ROLES } from "../database/models/user";
import { sendNotificationService } from "./notificationService";
import { NotificationType } from "../database/models/notification";

export const createOpenMarketPlaceService = async (payload) => {
  const openMarketPlace = await OpenMarketPlace.create(payload);

  const superAdmin = await User.findOne({
    where: { role: USER_ROLES.SUPER_ADMIN },
  });

  await sendNotificationService({
    title: `New Open Market Place Created.`,
    description: `A new open market place has been created. Please review and verify its details.`,
    senderId: payload.createdBy,
    referenceType: NotificationType.OPEN_MARKET_PLACES,
    referenceId: openMarketPlace.id,
    receiverId: superAdmin.id,
  });

  return {
    data: openMarketPlace,
  };
};

export const getOpenMarketPlacesService = async (
  userId,
  page,
  limit,
  filters,
  category,
  subCategory,
  state,
  district,
  status,
  listingType,
  isFavourite,
  search,
) => {
  const offset = (page - 1) * limit;

  const { categories, subCategories, location } = filters;

  const whereCondition: any = {};

  if (listingType === "own") {
    whereCondition.createdBy = userId;
  } else if (listingType === "others") {
    whereCondition.status = OPEN_MARKET_STATUS.APPROVED;
    whereCondition.isActive = true;
  }

  if (Array.isArray(categories) && categories.length > 0) {
    const validCategories = categories
      .filter((s: string) => s?.trim())
      .map((s: string) => s.toLowerCase());

    if (validCategories.length) {
      whereCondition.category = Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("category")),
        { [Op.in]: validCategories },
      );
    }
  }

  if (Array.isArray(subCategories) && subCategories.length > 0) {
    const validSubCategories = subCategories
      .filter((s: string) => s?.trim())
      .map((s: string) => s.toLowerCase());

    if (validSubCategories.length) {
      whereCondition[Op.or] = [
        Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("machineryCategory")),
          { [Op.in]: validSubCategories },
        ),
        Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("serviceCategory")),
          { [Op.in]: validSubCategories },
        ),
      ];
    }
  }

  if (location) {
    whereCondition.locationOrCity = location;
  }

  if (state) {
    whereCondition.state = state;
  }

  if (district) {
    whereCondition.district = district;
  }

  if(status) {
    whereCondition.status = status;
  }

  if (category) {
    whereCondition.category = category;
  }

  if (subCategory) {
    whereCondition[Op.or] = [
      {
        machineryCategory: subCategory,
      },
      {
        serviceCategory: subCategory,
      },
    ];
  }

  const totalOpenMarketPlaces = await OpenMarketPlace.count();
  const totalApprovedOpenMarketPlaces = await OpenMarketPlace.count({
    where: { status: OPEN_MARKET_STATUS.APPROVED },
  });
  const totalRejectedOpenMarketPlaces = await OpenMarketPlace.count({
    where: { status: OPEN_MARKET_STATUS.REJECTED },
  });
  const totalPendingOpenMarketPlaces = await OpenMarketPlace.count({
    where: { status: OPEN_MARKET_STATUS.PENDING },
  });

  if (search && search.trim() !== "") {
    const searchTerm = `%${search.trim()}%`;

    whereCondition[Op.or] = [
      { machineryCategory: { [Op.iLike]: searchTerm } },
      { expectedPrice: { [Op.iLike]: searchTerm } },
      { brandName: { [Op.iLike]: searchTerm } },
    ];
  }

  let favouritePlaceIds: number[] = [];

  if (isFavourite === "true" && userId) {
    const likedPlaces = await LikeOpenMarketPlace.findAll({
      where: { userId },
      attributes: ["marketId"],
    });

    favouritePlaceIds = likedPlaces.map((l) => l.marketId);

    if (favouritePlaceIds.length === 0) {
      return {
        dashStats: {
          totalOpenMarketPlaces,
          totalApprovedOpenMarketPlaces,
          totalPendingOpenMarketPlaces,
          totalRejectedOpenMarketPlaces,
        },
        currentPage: page,
        total: 0,
        totalPages: 0,
        openMarketPlaces: [],
      };
    }

    whereCondition.id = { [Op.in]: favouritePlaceIds };
  }

  const { rows, count } = await OpenMarketPlace.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    distinct: true,
    order: [["createdAt", "DESC"]],
  });

  const placesWithLikeData = await Promise.all(
    rows.map(async (place) => {
      const [likeCount, likedRecord] = await Promise.all([
        LikeOpenMarketPlace.count({
          where: { marketId: place.id },
        }),
        userId
          ? LikeOpenMarketPlace.findOne({
              where: {
                userId,
                marketId: place.id,
              },
            })
          : null,
      ]);

      return {
        ...place.toJSON(),
        isLiked: !!likedRecord,
        likeCount,
      };
    }),
  );

  return {
    dashStats: {
      totalOpenMarketPlaces,
      totalApprovedOpenMarketPlaces,
      totalPendingOpenMarketPlaces,
      totalRejectedOpenMarketPlaces,
    },
    currentPage: page,
    total: count,
    totalPages: Math.ceil(count / limit),
    openMarketPlaces: placesWithLikeData,
  };
};

export const updateOpenMarketPlaceService = async (
  recordId,
  userId,
  payload,
) => {
  const record = await OpenMarketPlace.findOne({
    where: {
      id: recordId,
      createdBy: userId,
    },
  });

  if (!record)
    return {
      success: false,
      error: "Open Market Place record not found.",
      statusCode: 404,
    };

  if (record.status === OPEN_MARKET_STATUS.REJECTED) {
    payload.status = OPEN_MARKET_STATUS.PENDING;

    const superAdmin = await User.findOne({
      where: { role: USER_ROLES.SUPER_ADMIN },
    });

    await sendNotificationService({
      title: `Open Market Place Updated.`,
      description: `An open market place has been updated. Please review and verify its details.`,
      senderId: payload.createdBy,
      referenceType: NotificationType.OPEN_MARKET_PLACES,
      referenceId: record.id,
      receiverId: superAdmin.id,
    });
  }

  await record.update(payload);

  return {
    success: true,
    data: record,
  };
};
