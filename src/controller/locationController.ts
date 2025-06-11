import { Op } from "sequelize";

import State from "../database/models/state";
import City from "../database/models/city";
import District from "../database/models/district";

const getPagination = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};

export const listStates = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const { limit: pageLimit, offset } = getPagination(+page, +limit);

    const whereClause = search
      ? { name: { [Op.iLike]: `%${search}%` } }
      : undefined;

    const { count, rows: states } = await State.findAndCountAll({
      where: whereClause,
      order: [["position", "ASC"]],
      limit: pageLimit,
      offset,
    });

    return res.json({
      message: "States fetched successfully",
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / pageLimit),
        currentPage: +page,
      },
      states,
    });
  } catch (error) {
    console.error("Error fetching states:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const listCities = async (req, res) => {
  try {
    const { search = "", stateId, page = 1, limit = 10 } = req.query;
    const { limit: pageLimit, offset } = getPagination(+page, +limit);

    const whereClause = {
      ...(stateId && { stateId }),
      ...(search && { name: { [Op.iLike]: `%${search}%` } }),
    };

    const { count, rows: cities } = await City.findAndCountAll({
      where: whereClause,
      order: [["name", "ASC"]],
      limit: pageLimit,
      offset,
    });

    return res.json({
      message: "Cities fetched successfully",
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / pageLimit),
        currentPage: +page,
      },
      cities,
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const listDistricts = async (req, res) => {
  try {
    const { search = "", cityId, page = 1, limit = 10 } = req.query;
    const { limit: pageLimit, offset } = getPagination(+page, +limit);

    const whereClause = {
      ...(cityId && { cityId }),
      ...(search && { name: { [Op.iLike]: `%${search}%` } }),
    };

    const { count, rows: districts } = await District.findAndCountAll({
      where: whereClause,
      order: [["name", "ASC"]],
      limit: pageLimit,
      offset,
    });

    return res.json({
      message: "Districts fetched successfully",
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / pageLimit),
        currentPage: +page,
      },
      districts,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
