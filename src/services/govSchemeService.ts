import { Op } from "sequelize";
import GovernmentScheme from "../database/models/govScheme";

export const createGovSchemeService = async (payload) => {
  const scheme = await GovernmentScheme.create(payload);
  return {
    success: true,
    statusCode: 201,
    message: "Government scheme created successfully",
    data: scheme,
  };
};

export const listGovSchemesService = async ({
  search,
  page,
  limit,
  governmentType,
  category,
  isActive,
}) => {
  const whereClause: any = {};

  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { category: { [Op.iLike]: `%${search}%` } },
      { governmentType: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (governmentType) {
    whereClause.governmentType = governmentType;
  }

  if (category) {
    whereClause.category = category;
  }

  if (typeof isActive !== "undefined") {
    whereClause.isActive = isActive === "true";
  }

  const offset = (page - 1) * limit;

  const { rows, count } = await GovernmentScheme.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  return {
    success: true,
    statusCode: 200,
    message: "Government schemes fetched successfully",
    data: {
      total: count,
      page,
      perPage: limit,
      schemes: rows,
    },
  };
};

export const getGovSchemeByIdService = async (id) => {
  const scheme = await GovernmentScheme.findByPk(id);
  if (!scheme) {
    return {
      success: false,
      statusCode: 404,
      message: "Government scheme not found",
    };
  }
  return {
    success: true,
    statusCode: 200,
    message: "Government scheme fetched successfully",
    data: scheme,
  };
};

export const updateGovSchemeService = async (id, payload) => {
  const scheme = await GovernmentScheme.findByPk(id);
  if (!scheme) {
    return {
      success: false,
      statusCode: 404,
      message: "Government scheme not found",
    };
  }

  await scheme.update(payload);
  return {
    success: true,
    statusCode: 200,
    message: "Government scheme updated successfully",
    data: scheme,
  };
};

export const deleteGovSchemeService = async (id) => {
  const scheme = await GovernmentScheme.findByPk(id);
  if (!scheme) {
    return {
      success: false,
      statusCode: 404,
      message: "Government scheme not found",
    };
  }

  await scheme.destroy();
  return {
    success: true,
    statusCode: 200,
    message: "Government scheme deleted successfully",
  };
};
