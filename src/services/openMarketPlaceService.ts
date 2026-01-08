import { Op, Sequelize } from "sequelize";
import OpenMarketPlace, {
  OPEN_MARKET_STATUS,
} from "../database/models/openMarketPlace";

export const createOpenMarketPlaceService = async (payload) => {
  const openMarketPlace = await OpenMarketPlace.create(payload);

  return {
    data: openMarketPlace,
  };
};

export const getOpenMarketPlacesService = async (
  userId,
  page,
  limit,
  filters,
  category
) => {
  const offset = (page - 1) * limit;

  const { categories, subCategories, location } = filters;

  const whereCondition: any = {};

  if (userId) {
    whereCondition.createdBy = userId;
  }

  if (Array.isArray(categories) && categories.length > 0) {
    const validCategories = categories
      .filter((s: string) => s?.trim())
      .map((s: string) => s.toLowerCase());

    if (validCategories.length) {
      whereCondition.category = Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("category")),
        { [Op.in]: validCategories }
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
          { [Op.in]: validSubCategories }
        ),
        Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("serviceCategory")),
          { [Op.in]: validSubCategories }
        ),
      ];
    }
  }

  if (location) {
    whereCondition.locationOrCity = location;
  }

  if(category)
  {
    whereCondition.category= category;
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

  const { rows, count } = await OpenMarketPlace.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    distinct: true,
    order: [["createdAt", "DESC"]],
  });

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
    openMarketPlaces: rows,
  };
};
