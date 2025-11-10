import { Op } from "sequelize";

import ColdStorageRequirement from "../database/models/coldStorageRequirement";
import sequelize from "../database/models/db";
import { generateUniqueRequirementUid } from "../utils/generate";
import User, { USER_ROLES } from "../database/models/user";
import LikeCSRequirement from "../database/models/likeCSRequirement";
import CSRequirementView from "../database/models/csRequirementView";

export const getRequirementsService = async (
  userId: number,
  page: number,
  limit: number,
  listingType: "own" | "others" | "all" = "own",
  filters: {
    commodityType?: string;
    verified?: string;
    district?: string;
    pbVerified?: string;
    isFavourite?: string;
  },
  sortBy: string = ""
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

  if (filters.district && filters.district.toLowerCase() !== "all") {
    whereCondition.district = { [Op.iLike]: filters.district };
  }

  const userInclude: any = {
    model: User,
    as: "creator",
    attributes: ["id", "name", "role", "email", "mobile", "pbVerified"],
  };

  if (filters.pbVerified && filters.pbVerified.toLowerCase() !== "all") {
    userInclude.where = { pbVerified: filters.pbVerified === "true" };
    userInclude.required = true;
  }

  let favouriteRequirementIds: number[] = [];
  if (filters.isFavourite && filters.isFavourite === "true") {
    const likedRecords = await LikeCSRequirement.findAll({
      where: { userId },
      attributes: ["requirementId"],
    });

    favouriteRequirementIds = likedRecords.map((like) => like.requirementId);

    if (favouriteRequirementIds.length === 0) {
      return {
        total: 0,
        page,
        perPage: limit,
        totalPages: 0,
        requirements: [],
      };
    }

    whereCondition.id = { [Op.in]: favouriteRequirementIds };
  }

  let order: any = [["updatedAt", "DESC"]];
  if (sortBy) {
    switch (String(sortBy).toLowerCase()) {
      case "created_asc":
        order = [["createdAt", "ASC"]];
        break;
      case "created_desc":
        order = [["createdAt", "DESC"]];
        break;
      default:
        order = [["updatedAt", "DESC"]];
    }
  }

  const { rows, count } = await ColdStorageRequirement.findAndCountAll({
    where: whereCondition,
    include: [userInclude],
    order,
    limit,
    offset,
  });

  const requirementsWithCounts = await Promise.all(
    rows.map(async (req) => {
      const [viewCount, likeCount, likedRecord] = await Promise.all([
        CSRequirementView.count({
          where: { requirementId: req.id },
        }),
        LikeCSRequirement.count({
          where: { requirementId: req.id },
        }),
        LikeCSRequirement.findOne({
          where: { requirementId: req.id, userId },
        }),
      ]);

      return {
        ...req.toJSON(),
        isLiked: !!likedRecord,
        likeCount,
        viewCount,
      };
    })
  );

  return {
    total: count,
    page,
    perPage: limit,
    totalPages: Math.ceil(count / limit),
    requirements: requirementsWithCounts,
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

export const getRequirementByIdService = async (
  id: number,
  userId: number,
  role: string
) => {
  const requirement = await ColdStorageRequirement.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: "creator",
        attributes: [
          "id",
          "name",
          "role",
          "email",
          "mobile",
          "pbVerified",
          "profilePicture",
        ],
      },
    ],
  });

  if (!requirement) {
    return null;
  }

  if (role === USER_ROLES.USER) {
    await CSRequirementView.findOrCreate({
      where: { userId, requirementId: id },
      defaults: { userId, requirementId: id },
    });
  }

  const jsonReq = requirement.toJSON();

  const [viewCount, likeCount, likedRecord] = await Promise.all([
    CSRequirementView.count({
      where: { requirementId: id },
    }),
    LikeCSRequirement.count({
      where: { requirementId: id },
    }),
    LikeCSRequirement.findOne({
      where: { requirementId: id, userId },
    }),
  ]);

  return {
    ...jsonReq,
    isLiked: !!likedRecord,
    viewCount,
    likeCount,
  };
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

export const likeOrDislikeRequirementService = async (
  userId,
  requirementId
) => {
  const isValidColdStorageRequirement = await ColdStorageRequirement.findByPk(
    requirementId
  );

  if (!isValidColdStorageRequirement)
    return {
      success: false,
      error: "Cold Storage Requirement not found!",
    };

  const isExistingColdStorageRequirementLiked = await LikeCSRequirement.findOne(
    {
      where: { userId, requirementId },
    }
  );

  if (isExistingColdStorageRequirementLiked) {
    await LikeCSRequirement.destroy({ where: { userId, requirementId } });
    return {
      success: true,
      data: "Cold Storage Requirement disliked successfully!",
    };
  } else {
    await LikeCSRequirement.create({ userId, requirementId });
    return {
      success: true,
      data: "Cold Storage Requirement liked successfully!",
    };
  }
};
