import { literal, Op } from "sequelize";
import ColdStorage from "../database/models/coldStorage";
import ColdStorageRequirement from "../database/models/coldStorageRequirement";
import sequelize from "../database/models/db";
import InterestRequest from "../database/models/interestRequest";
import { REGISTRATION_STATUS } from "../database/models/user";
import StorageType from "../database/models/storageType";
import { generateUniqueRequirementUid } from "../utils/generate";

export const getMyRequirementsService = async (userId, page, limit) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await ColdStorageRequirement.findAndCountAll({
    where: { createdBy: userId },
    include: [
      {
        model: InterestRequest,
        as: "interestRequests",
        include: [
          {
            model: ColdStorage,
            as: "coldStorage",
            attributes: ["id", "name", "state", "district", "totalCapacityMt"],
          },
        ],
      },
    ],
    distinct: true,
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

    const whereCondition: any = { isDeleted: false };

    if (requirement.verified && requirement.verified.toString() === "true") {
      whereCondition.status = REGISTRATION_STATUS.APPROVED;
    }

    if (requirement.state) {
      whereCondition.state = { [Op.iLike]: requirement.state };
    }

    if (requirement.district) {
      whereCondition.district = { [Op.iLike]: requirement.district };
    }

    if (requirement.capacityMin && requirement.capacityMax) {
      whereCondition.totalCapacityMt = {
        [Op.between]: [
          Number(requirement.capacityMin),
          Number(requirement.capacityMax),
        ],
      };
    } else if (requirement.capacityMin) {
      whereCondition.totalCapacityMt = {
        [Op.gte]: Number(requirement.capacityMin),
      };
    } else if (requirement.capacityMax) {
      whereCondition.totalCapacityMt = {
        [Op.lte]: Number(requirement.capacityMax),
      };
    }

    const normalizedType = (requirement.storageType || "").toLowerCase();
    if (requirement.storageType && normalizedType !== "all") {
      whereCondition.id = {
        [Op.in]: literal(`(
          SELECT "coldStorageId"
          FROM "storageTypes"
           WHERE LOWER("storageType") = LOWER('${requirement.storageType}')
        )`),
      };
    }

    const matchingStorages = await ColdStorage.findAll({
      where: whereCondition,
      include: [
        {
          model: StorageType,
          as: "storageTypes",
          attributes: ["id", "storageType"],
        },
      ],
      transaction: t,
    });

    const interestRequests = matchingStorages.map((storage) => ({
      senderUserId: requirement.createdBy,
      requirementId: requirement.id,
      coldStorageId: storage.id,
    }));

    if (interestRequests.length > 0) {
      await InterestRequest.bulkCreate(interestRequests, { transaction: t });
    }

    return {
      requirement,
      interestRequestsCount: interestRequests.length,
    };
  });
};
