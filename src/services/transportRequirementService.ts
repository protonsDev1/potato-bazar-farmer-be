import { Op } from "sequelize";

import sequelize from "../database/models/db";
import User, { USER_ROLES } from "../database/models/user";
import { canUpdateResource } from "../utils/commonCode";
import { PERMISSIONS } from "../utils/constants/permissions";
import { sendNotificationService } from "./notificationService";
import { NotificationType } from "../database/models/notification";
import { TRANSPORT_SERVICE_STATUS } from "../database/models/transportRequirement";
import TransportRequirement from "../database/models/transportRequirement";
import LikeTransportRequirement from "../database/models/likeTransportRequirement";
import TransportRequirementView from "../database/models/transportRequirementView";
import { generateUniqueRequirementUid } from "../utils/generate";

export const getTransportRequirementsService = async (
  userId: number,
  page: number,
  limit: number,
  listingType: "own" | "others" | "all" = "own",
  filters: {
    pbVerified?: string;
    packaging?: string;
    pickState?: string;
    dropState?: string;
    vehicleType?: string;
    isFavourite?: string;
    status?: string;
  },
  sortBy: string = "",
  search: string = "",
) => {
  const offset = (page - 1) * limit;

  const userWhere: any = {};
  const whereCondition: any = {};

  if (listingType === "own") {
    whereCondition.createdBy = userId;
  } else if (listingType === "others") {
    // whereCondition.createdBy = { [Op.ne]: userId };
    whereCondition.status = TRANSPORT_SERVICE_STATUS.APPROVED;
    whereCondition.isActive = true;
    userWhere.isActive = true;
    userWhere.isDeleted = false;
  }

  if (filters.packaging && filters.packaging.toLowerCase() !== "all") {
    whereCondition.packaging = { [Op.iLike]: filters.packaging };
  }

  if (filters.pickState && filters.pickState.toLowerCase() !== "all") {
    whereCondition.pickState = { [Op.iLike]: filters.pickState };
  }

  if (filters.dropState && filters.dropState.toLowerCase() !== "all") {
    whereCondition.dropState = { [Op.iLike]: filters.dropState };
  }

  if (filters.vehicleType) {
    whereCondition.vehicleTypeRequired = {
      [Op.contains]: [filters.vehicleType],
    };
  }

  if (filters.status && filters.status.toLowerCase() !== "all") {
    whereCondition.status = { [Op.iLike]: filters.status };
  }

  if (search && search.trim() !== "") {
    const searchTerm = `%${search.trim()}%`;

    whereCondition[Op.or] = [
      { requirementUid: { [Op.iLike]: searchTerm } },
      { pickState: { [Op.iLike]: searchTerm } },
      { dropState: { [Op.iLike]: searchTerm } },
    ];

    if (!isNaN(Number(search))) {
      whereCondition[Op.or].push({
        quantity: Number(search),
      });
    }
  }

  const userInclude: any = {
    model: User,
    as: "creator",
    // attributes: [
    //   "id",
    //   "name",
    //   "role",
    //   "email",
    //   "mobile",
    //   "pbVerified",
    //   "isActive",
    //   "isDeleted",
    //   "createdAt",
    //   "updatedAt",
    // ],
    where: userWhere,
  };

  if (filters.pbVerified && filters.pbVerified.toLowerCase() !== "all") {
    userInclude.where = { pbVerified: filters.pbVerified === "true" };
    userInclude.required = true;
  }

  let favouriteRequirementIds: number[] = [];
  if (filters.isFavourite && filters.isFavourite === "true") {
    const likedRecords = await LikeTransportRequirement.findAll({
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

  let order: any = [["createdAt", "DESC"]];
  if (sortBy) {
    switch (String(sortBy).toLowerCase()) {
      case "created_asc":
        order = [["createdAt", "ASC"]];
        break;
      case "created_desc":
        order = [["createdAt", "DESC"]];
        break;
      default:
        order = [["createdAt", "DESC"]];
    }
  }

  const { rows, count } = await TransportRequirement.findAndCountAll({
    where: whereCondition,
    include: [userInclude],
    order,
    limit,
    offset,
  });

  const requirementsWithCounts = await Promise.all(
    rows.map(async (req) => {
      const [viewCount, likeCount, likedRecord] = await Promise.all([
        TransportRequirementView.count({
          where: { requirementId: req.id },
        }),
        LikeTransportRequirement.count({
          where: { requirementId: req.id },
        }),
        LikeTransportRequirement.findOne({
          where: { requirementId: req.id, userId },
        }),
      ]);

      return {
        ...req.toJSON(),
        isLiked: !!likedRecord,
        likeCount,
        viewCount,
      };
    }),
  );

  return {
    total: count,
    page,
    perPage: limit,
    totalPages: Math.ceil(count / limit),
    requirements: requirementsWithCounts,
  };
};

export const createTransportRequirementAndInterests = async (data) => {
  return await sequelize.transaction(async (t) => {
    const requirementUid = await generateUniqueRequirementUid();
    const requirementData = { ...data, requirementUid };

    const requirement = await TransportRequirement.create(requirementData);

    return requirement;
  });
};

export const getTransportRequirementByIdService = async (
  id: number,
  userId: number,
  role: string,
) => {
  const requirement = await TransportRequirement.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: "creator",
        // attributes: [
        //   "id",
        //   "name",
        //   "role",
        //   "email",
        //   "mobile",
        //   "pbVerified",
        //   "profilePicture",
        // ],
      },
    ],
  });

  if (!requirement) {
    return null;
  }

  if (role === USER_ROLES.USER) {
    await TransportRequirementView.findOrCreate({
      where: { userId, requirementId: id },
      defaults: { userId, requirementId: id },
    });
  }

  const jsonReq = requirement.toJSON();

  const [viewCount, likeCount, likedRecord] = await Promise.all([
    TransportRequirementView.count({
      where: { requirementId: id },
    }),
    LikeTransportRequirement.count({
      where: { requirementId: id },
    }),
    LikeTransportRequirement.findOne({
      where: { requirementId: id, userId },
    }),
  ]);

  return {
    ...jsonReq,
    isLiked: !!likedRecord,
    viewCount,
    likeCount,
    isOwner: requirement.createdBy === userId,
  };
};

export const updateRequirementService = async (
  id: number,
  user: User,
  data: any,
) => {
  const requirement = await TransportRequirement.findByPk(id);

  if (!requirement) {
    return {
      success: false,
      statusCode: 404,
      message: "Requirement not found",
    };
  }

  const hasAccess = await canUpdateResource(
    user,
    requirement.createdBy,
    PERMISSIONS.TRANSPORT_SERVICE,
  );

  if (!hasAccess) {
    return {
      statusCode: 403,
      success: false,
      message:
        "Only the owner, a super admin, or an authorized sub admin is allowed to update this requirement.",
    };
  }

  // if (requirement.status === TRANSPORT_SERVICE_STATUS.APPROVED) {
  if (Object.keys(data).length === 1 && data.hasOwnProperty("isActive")) {
    await requirement.update({ isActive: data.isActive });
    return {
      statusCode: 200,
      success: true,
      message: "Requirement status updated successfully",
      data: requirement,
    };
  }

  // return {
  //   statusCode: 400,
  //   success: false,
  //   message: "Approved requirement cannot be modified",
  // };
  // }

  if (requirement.status !== TRANSPORT_SERVICE_STATUS.PENDING) {
    data.status = TRANSPORT_SERVICE_STATUS.PENDING;

    const superAdmin = await User.findOne({
      where: { role: USER_ROLES.SUPER_ADMIN },
    });

    await sendNotificationService({
      title: "Transport Requirement",
      description:
        "A Transport Requirement has been moved to pending, please check it.",
      senderId: user.id,
      receiverId: superAdmin.id,
      referenceType: NotificationType.TRANSPORT_REQUIREMENT,
      referenceId: id,
    });
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
  const requirement = await TransportRequirement.findByPk(id);

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
  requirementId,
) => {
  const isValidTransportRequirement =
    await TransportRequirement.findByPk(requirementId);

  if (!isValidTransportRequirement)
    return {
      success: false,
      error: "Transport Requirement not found!",
    };

  const isExistingTransportRequirementLiked =
    await LikeTransportRequirement.findOne({
      where: { userId, requirementId },
    });

  if (isExistingTransportRequirementLiked) {
    await LikeTransportRequirement.destroy({
      where: { userId, requirementId },
    });
    return {
      success: true,
      data: "Transport Requirement disliked successfully!",
    };
  } else {
    await LikeTransportRequirement.create({ userId, requirementId });
    return {
      success: true,
      data: "Transport Requirement liked successfully!",
    };
  }
};

export const updateTransportRequirementStatusService = async (
  requirementId,
  status,
  reason,
) => {
  const requirement = await TransportRequirement.findByPk(requirementId);

  if (!requirement) {
    return null;
  }

  requirement.status = status;

  if (status === TRANSPORT_SERVICE_STATUS.REJECTED) {
    requirement.reason = reason || null;
  } else {
    requirement.reason = null;
  }

  await requirement.save();

  return requirement;
};
