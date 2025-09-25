import { Op } from "sequelize";

import ColdStorageRequirement from "../database/models/coldStorageRequirement";
import sequelize from "../database/models/db";
import { generateUniqueRequirementUid } from "../utils/generate";
import User from "../database/models/user";

export const getRequirementsService = async (
  userId: number,
  page: number,
  limit: number,
  listingType: "own" | "others" | "all" = "own",
  filters: { commodityType?: string; verified?: string }
) => {
  const offset = (page - 1) * limit;

  const whereCondition: any = {};

  if (listingType === "own") {
    whereCondition.createdBy = userId;
  } else if (listingType === "others") {
    whereCondition.createdBy = { [Op.ne]: userId };
    whereCondition.isActive = true;
  }

  if (filters.commodityType && filters.commodityType.toLowerCase() !== "all") {
    whereCondition.commodityType = { [Op.iLike]: filters.commodityType };
  }

  if (filters.verified) {
    whereCondition.verified = filters.verified === "true";
  }

  const { rows, count } = await ColdStorageRequirement.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "name", "role", "email", "mobile"],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    total: count,
    page,
    perPage: limit,
    totalPages: Math.ceil(count / limit),
    requirements: rows,
  };
};

export const createRequirementAndInterests = async (data) => {
  return await sequelize.transaction(async (t) => {
    const requirementUid = await generateUniqueRequirementUid();
    const requirementData = { ...data, requirementUid };

    const requirement = await ColdStorageRequirement.create(requirementData, {
      transaction: t,
    });

    return requirement;
  });
};

export const getRequirementByIdService = async (id: number, userId: number) => {
  return await ColdStorageRequirement.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "name", "role", "email", "mobile"],
      },
    ],
  });
};

export const updateRequirementService = async (
  id: number,
  userId: number,
  data: any
) => {
  const requirement = await ColdStorageRequirement.findByPk(id);

  if (!requirement) {
    return {
      success: false,
      statusCode: 404,
      message: "Requirement not found",
    };
  }

  if (requirement.createdBy !== userId) {
    return {
      success: false,
      statusCode: 403,
      message: "You are not allowed to update this requirement",
    };
  }

  await requirement.update(data);

  return {
    success: true,
    statusCode: 200,
    message: "Requirement updated successfully",
    data: requirement,
  };
};

export const deleteRequirementService = async (id: number, userId: number) => {
  const requirement = await ColdStorageRequirement.findByPk(id);

  if (!requirement) {
    return {
      success: false,
      statusCode: 404,
      message: "Requirement not found",
    };
  }

  if (requirement.createdBy !== userId) {
    return {
      success: false,
      statusCode: 403,
      message: "You are not allowed to delete this requirement",
    };
  }

  await requirement.destroy();

  return {
    success: true,
    statusCode: 200,
    message: "Requirement deleted successfully",
  };
};
