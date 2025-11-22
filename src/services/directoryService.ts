import { literal, Op } from "sequelize";
import sequelize from "../database/models/db";

import User, { REGISTRATION_STATUS, USER_ROLES } from "../database/models/user";
import Directory from "../database/models/directory";
import DirectorySocialMedia from "../database/models/directorySocialMedia";
import DirectoryMedia from "../database/models/directoryMedia";
import DirectoryCategoryMapping from "../database/models/directoryCategoryMapping";
import { convertISTDateRangeToUTC } from "../utils/dateFormat";
import DirectoryCategory from "../database/models/directoryCategory";
import DirectorySubCategory from "../database/models/directorySubCategory";
import SavedDirectory from "../database/models/savedDirectory";
import DirectoryPlan from "../database/models/directoryPlan";
import { sendNotificationService } from "./notificationService";
import { NotificationType } from "../database/models/notification";

export async function onboardDirectory(payload) {
  try {
    return await sequelize.transaction(async (t) => {
      const planId = payload.planId;
      const plan = await DirectoryPlan.findByPk(planId, { transaction: t });
      if (!plan) throw new Error("Invalid planId");

      const isFree = plan.name === "PB Free";
      const start = payload.planStartDate
        ? new Date(payload.planStartDate)
        : null;
      const end = payload.planEndDate ? new Date(payload.planEndDate) : null;

      if (isFree) {
        if (payload.planStartDate || payload.planEndDate) {
          throw new Error(
            "PB Free plan should not include planStartDate or planEndDate"
          );
        }
      } else {
        if (!start || !end)
          throw new Error("Paid plans require planStartDate and planEndDate");
        if (end <= start)
          throw new Error("planEndDate must be after planStartDate");
      }

      const createData = { ...payload };
      delete createData.subCategoryIds;

      const directory = await Directory.create(createData, { transaction: t });

      if (payload.socialMedia)
        await DirectorySocialMedia.create(
          { directoryId: directory.id, ...payload.socialMedia },
          { transaction: t }
        );

      if (payload.media)
        await DirectoryMedia.create(
          { directoryId: directory.id, ...payload.media },
          { transaction: t }
        );

      if (payload.subCategoryIds && Array.isArray(payload.subCategoryIds)) {
        const pairs = await mapSubCategoryIdsToPairs(payload.subCategoryIds);
        if (pairs.length > 0) {
          const records = pairs.map((p) => ({
            directoryId: directory.id,
            ...p,
          }));
          await DirectoryCategoryMapping.bulkCreate(records, {
            transaction: t,
          });
        }
      }

      return directory;
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function updateDirectoryService(directoryId, payload) {
  return await sequelize.transaction(async (t) => {
    const directory = await Directory.findByPk(directoryId, { transaction: t });
    if (!directory) throw new Error("Directory not found");

    // Plan change handling
    const hasPlanKey = Object.prototype.hasOwnProperty.call(payload, "planId");
    const hasPlanStart = Object.prototype.hasOwnProperty.call(
      payload,
      "planStartDate"
    );
    const hasPlanEnd = Object.prototype.hasOwnProperty.call(
      payload,
      "planEndDate"
    );

    if (hasPlanKey) {
      const plan = await DirectoryPlan.findByPk(payload.planId, {
        transaction: t,
      });
      if (!plan) throw new Error("Invalid planId");

      const isFree = plan.name === "PB Free";
      const start = hasPlanStart
        ? payload.planStartDate
          ? new Date(payload.planStartDate)
          : null
        : directory.planStartDate
        ? new Date(directory.planStartDate)
        : null;
      const end = hasPlanEnd
        ? payload.planEndDate
          ? new Date(payload.planEndDate)
          : null
        : directory.planEndDate
        ? new Date(directory.planEndDate)
        : null;

      if (isFree) {
        // clear dates if present in payload or existing
        payload.planStartDate = null;
        payload.planEndDate = null;
      } else {
        if (!start || !end)
          throw new Error("Paid plans require planStartDate and planEndDate");
        if (end <= start)
          throw new Error("planEndDate must be after planStartDate");
      }
    } else if (hasPlanStart || hasPlanEnd) {
      // only dates updating; ensure current plan is not PB_FREE
      const currentPlan = await DirectoryPlan.findByPk(directory.planId, {
        transaction: t,
      });
      if (!currentPlan) throw new Error("Current plan not found");
      if (currentPlan.name === "PB Free")
        throw new Error("Cannot set plan dates for PB_FREE plan");

      const start = hasPlanStart
        ? payload.planStartDate
          ? new Date(payload.planStartDate)
          : null
        : directory.planStartDate
        ? new Date(directory.planStartDate)
        : null;
      const end = hasPlanEnd
        ? payload.planEndDate
          ? new Date(payload.planEndDate)
          : null
        : directory.planEndDate
        ? new Date(directory.planEndDate)
        : null;

      if (!start || !end)
        throw new Error(
          "Both planStartDate and planEndDate are required when updating dates"
        );
      if (end <= start)
        throw new Error("planEndDate must be after planStartDate");
    }

    const updateData = { ...payload };

    await directory.update(updateData, { transaction: t });

    if (payload.socialMedia)
      await DirectorySocialMedia.upsert(
        { directoryId, ...payload.socialMedia },
        { transaction: t }
      );

    if (payload.media)
      await DirectoryMedia.upsert(
        { directoryId, ...payload.media },
        { transaction: t }
      );

    if (
      Array.isArray(payload.subCategoryIds) &&
      payload.subCategoryIds.length > 0
    ) {
      const syncResult = await syncDirectoryCategoryMappings(
        directoryId,
        payload.subCategoryIds,
        t
      );
      console.log(`Synced DirectoryCategoryMapping:`, syncResult);
    }

    return directory;
  });
}

export const retrieveDirectoryProfile = async (directoryId, currentUserId?) => {
  try {
    const [info, socialMedia, media, categoryMappings] = await Promise.all([
      Directory.findByPk(directoryId, {
        include: [
          {
            model: User,
            as: "owner",
            attributes: ["id", "name", "role", "email", "mobile"],
          },
          {
            model: User,
            as: "onboardedByUser",
            attributes: ["id", "name", "role", "email", "mobile"],
          },
          {
            model: DirectoryPlan,
            as: "plan",
            attributes: [
              "id",
              "name",
              "priority",
              "homePagePosition",
              "categoryPagePosition",
              "slotLimit",
            ],
            required: false,
          },
        ],
      }),
      DirectorySocialMedia.findOne({ where: { directoryId } }),
      DirectoryMedia.findOne({ where: { directoryId } }),
      DirectoryCategoryMapping.findAll({
        where: { directoryId },
        include: [
          {
            model: DirectoryCategory,
            attributes: ["id", "name"],
            as: "category",
          },
          {
            model: DirectorySubCategory,
            attributes: ["id", "name"],
            as: "subCategory",
          },
        ],
      }),
    ]);

    let isSaved = false;
    if (currentUserId) {
      const saved = await SavedDirectory.findOne({
        where: { userId: currentUserId, directoryId },
      });
      isSaved = !!saved;
    }

    return {
      info,
      socialMedia,
      media,
      categoryMappings,
      isSaved,
    };
  } catch (err) {
    console.error("Error in retrieveDirectoryProfile:", err);
    throw err;
  }
};

export const getDirectoryListByAdmin = async (
  page = 1,
  limit = 10,
  filters: any = {},
  search?,
  sortBy?,
  currentUserId?: number
) => {
  try {
    const offset = (page - 1) * limit;
    const whereCondition: any = {};

    const {
      state,
      city,
      registrationDate,
      onboardedByUser,
      listingType,
      status,
      categoryId,
      subCategoryId,
      planId,
      isSaved,
      industryServed,
    } = filters;

    const now = new Date();

    let mobileSortByPlanPriority = false;
    if (listingType && String(listingType).toLowerCase() === "mobile") {
      whereCondition.status = REGISTRATION_STATUS.APPROVED;
      whereCondition.isActive = true;

      whereCondition[Op.and] = [
        {
          [Op.or]: [
            { planStartDate: null },
            { planEndDate: null },
            {
              [Op.and]: [
                { planStartDate: { [Op.lte]: now } },
                { planEndDate: { [Op.gte]: now } },
              ],
            },
          ],
        },
      ];

      mobileSortByPlanPriority = true;
    }

    if (status) whereCondition.status = status;

    if (state && state.toLowerCase() !== "all")
      whereCondition.state = { [Op.iLike]: state };

    if (city && city.toLowerCase() !== "all")
      whereCondition.city = { [Op.iLike]: city };

    if (planId && String(planId).toLowerCase() !== "all") {
      const pid = Number(planId);
      if (!Number.isNaN(pid)) whereCondition.planId = pid;
    }

    if (categoryId && String(categoryId).toLowerCase() !== "all") {
      whereCondition.id = {
        [Op.in]: literal(`
      (SELECT "directoryId" FROM "directoryCategoryMappings"
       WHERE "categoryId" = ${Number(categoryId)}
       ${
         subCategoryId && String(subCategoryId).toLowerCase() !== "all"
           ? `AND "subCategoryId" = ${Number(subCategoryId)}`
           : ""
       })
    `),
      };
    }

    if (industryServed) {
      const industry = String(industryServed).trim();
      if (industry) {
        whereCondition.industriesServed = { [Op.contains]: [industry] };
      }
    }

    if (registrationDate && registrationDate.length === 2) {
      const [startDate, endDate] = registrationDate;
      if (startDate && endDate) {
        const { startUTC, endUTC } = convertISTDateRangeToUTC(
          startDate,
          endDate
        );
        whereCondition.createdAt = {
          [Op.between]: [new Date(startUTC), new Date(endUTC)],
        };
      }
    }

    let onBoardedByUserWhere: any = {};
    if (onboardedByUser && onboardedByUser.toLowerCase() !== "all") {
      const type = onboardedByUser.toLowerCase();

      if (type === "self") {
        onBoardedByUserWhere = {
          [Op.or]: [{ role: USER_ROLES.USER }],
        };
      }

      if (type === "admin") {
        onBoardedByUserWhere = {
          role: {
            [Op.in]: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SUB_ADMIN],
          },
        };
      }
    }

    if (search?.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereCondition[Op.or] = [
        { companyName: { [Op.iLike]: searchTerm } },
        { contactPersonName: { [Op.iLike]: searchTerm } },
        { email: { [Op.iLike]: searchTerm } },

        literal(`
      "Directory"."id" IN (
        SELECT "directoryId" 
        FROM "directoryCategoryMappings" dcm
        LEFT JOIN "directoryCategories" dc 
          ON dcm."categoryId" = dc."id"
        LEFT JOIN "directorySubCategories" dsc 
          ON dcm."subCategoryId" = dsc."id"
        WHERE dc."name" ILIKE '${searchTerm}'
           OR dsc."name" ILIKE '${searchTerm}'
      )
    `),
      ];
    }

    let order: any = [["createdAt", "DESC"]];
    if (mobileSortByPlanPriority) {
      order = [
        [{ model: DirectoryPlan, as: "plan" }, "priority", "ASC"],
        ["createdAt", "DESC"],
      ];
    } else if (sortBy) {
      switch (String(sortBy).toLowerCase()) {
        case "company_asc":
          order = [["companyName", "ASC"]];
          break;
        case "company_desc":
          order = [["companyName", "DESC"]];
          break;
        case "created_asc":
          order = [["createdAt", "ASC"]];
          break;
        case "created_desc":
          order = [["createdAt", "DESC"]];
          break;
        case "updated_asc":
          order = [["updatedAt", "ASC"]];
          break;
        case "updated_desc":
          order = [["updatedAt", "DESC"]];
          break;
        default:
          order = [["createdAt", "DESC"]];
      }
    }

    const include: any[] = [
      { model: User, as: "owner", attributes: ["id", "name", "mobile"] },
      {
        model: User,
        as: "onboardedByUser",
        attributes: ["id", "name", "email", "role", "mobile"],
        where: Object.keys(onBoardedByUserWhere).length
          ? onBoardedByUserWhere
          : undefined,
        required: Object.keys(onBoardedByUserWhere).length > 0,
      },
      {
        model: DirectoryPlan,
        as: "plan",
        attributes: [
          "id",
          "name",
          "priority",
          "homePagePosition",
          "categoryPagePosition",
          "slotLimit",
        ],
        required: false,
      },
    ];

    if (currentUserId) {
      include.push({
        model: SavedDirectory,
        as: "savedDirectories",
        attributes: ["id"],
        required: isSaved === "true",
        where: { userId: currentUserId },
      });
    }

    const { count, rows } = await Directory.findAndCountAll({
      where: whereCondition,
      include,
      limit: Number(limit),
      offset,
      order,
      distinct: true,
    });

    const directories = rows.map((dir: any) => ({
      ...dir.toJSON(),
      isSaved: !!(dir.savedDirectories && dir.savedDirectories.length > 0),
    }));

    return {
      totalCount: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      directories,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteDirectoryById = async (id) => {
  const directory = await Directory.findByPk(id);
  if (!directory)
    return { success: false, status: 404, message: "Directory not found" };
  await Directory.destroy({ where: { id } });
  return { success: true, data: directory };
};

export const toggleSaveDirectoryService = async (userId, directoryId) => {
  try {
    return await sequelize.transaction(async (t) => {
      const existing = await SavedDirectory.findOne({
        where: { userId, directoryId },
        transaction: t,
      });

      if (existing) {
        await existing.destroy({ transaction: t });
        return { success: true, action: "unsaved" };
      }

      const created = await SavedDirectory.create(
        { userId, directoryId },
        { transaction: t }
      );

      return { success: true, action: "saved", data: created };
    });
  } catch (err) {
    console.error("toggleSaveDirectoryService error:", err);
    return {
      success: false,
      status: 500,
      message: "Failed to toggle saved directory",
    };
  }
};

async function mapSubCategoryIdsToPairs(subCategoryIds = []) {
  if (!Array.isArray(subCategoryIds) || subCategoryIds.length === 0) return [];

  // dedupe
  const ids = Array.from(
    new Set(
      subCategoryIds.map((v) => Number(v)).filter((v) => !Number.isNaN(v))
    )
  );

  if (ids.length === 0) return [];

  // fetch subcategories
  const subs = await DirectorySubCategory.findAll({
    where: { id: ids },
    attributes: ["id", "categoryId"],
    raw: true,
  });

  const foundIds = new Set(subs.map((s) => s.id));
  const missing = ids.filter((id) => !foundIds.has(id));
  if (missing.length > 0) {
    throw new Error(`Invalid subCategoryIds: ${missing.join(", ")}`);
  }

  return subs.map((s) => ({ categoryId: s.categoryId, subCategoryId: s.id }));
}

export const syncDirectoryCategoryMappings = async (
  directoryId,
  subCategoryIds = [],
  transaction
) => {
  if (!transaction)
    throw new Error(
      "Transaction is required for syncDirectoryCategoryMappings"
    );

  // Step 1: normalize & validate incoming subCategoryIds
  if (!Array.isArray(subCategoryIds))
    throw new Error("subCategoryIds must be an array");
  const uniqueIds = Array.from(
    new Set(subCategoryIds.map((id) => Number(id)).filter((id) => !isNaN(id)))
  );
  if (uniqueIds.length === 0) return { createdCount: 0, deletedCount: 0 };

  // Step 2: resolve subCategoryIds → { categoryId, subCategoryId } pairs
  const pairs = await mapSubCategoryIdsToPairs(uniqueIds); // throws if invalid ids
  if (pairs.length === 0) return { createdCount: 0, deletedCount: 0 };

  // Step 3: load existing mappings for this directory
  const existingRows = await DirectoryCategoryMapping.findAll({
    where: { directoryId },
    attributes: ["id", "categoryId", "subCategoryId"],
    transaction,
    raw: true,
  });

  const existingKeyMap = new Map();
  for (const r of existingRows) {
    const key = `${r.categoryId}|${r.subCategoryId}`;
    existingKeyMap.set(key, r);
  }

  // Step 4: find new pairs to create
  const incomingKeySet = new Set(
    pairs.map((p) => `${p.categoryId}|${p.subCategoryId}`)
  );
  const toCreate = pairs
    .filter((p) => !existingKeyMap.has(`${p.categoryId}|${p.subCategoryId}`))
    .map((p) => ({
      directoryId,
      categoryId: p.categoryId,
      subCategoryId: p.subCategoryId,
    }));

  // Step 5: find old pairs to delete
  const toDelete = existingRows.filter(
    (r) => !incomingKeySet.has(`${r.categoryId}|${r.subCategoryId}`)
  );

  // Step 6: perform DB changes
  let createdCount = 0;
  let deletedCount = 0;

  if (toCreate.length > 0) {
    const created = await DirectoryCategoryMapping.bulkCreate(toCreate, {
      transaction,
    });
    createdCount = created.length;
  }

  if (toDelete.length > 0) {
    const deleteConditions = toDelete.map((r) => ({
      directoryId,
      categoryId: r.categoryId,
      subCategoryId: r.subCategoryId,
    }));

    const deleted = await DirectoryCategoryMapping.destroy({
      where: { [Op.or]: deleteConditions },
      transaction,
    });

    deletedCount = deleted;
  }

  return { createdCount, deletedCount };
};

export const getDirectoryPlansService = async () => {
  const plans = await DirectoryPlan.findAll({
    order: [["priority", "ASC"]],
    attributes: [
      "id",
      "name",
      "priority",
      "homePagePosition",
      "categoryPagePosition",
      "slotLimit",
    ],
  });
  return plans;
};

export const updateDirectoryStatusService = async (payload) => {
  const { directoryId, status, reason = null, currentUserId } = payload;

  if (!["approved", "rejected"].includes(String(status))) {
    return {
      success: false,
      statusCode: 400,
      message: "Invalid status. Allowed values: 'approved', 'rejected'",
    };
  }

  if (String(status) === "rejected" && !reason) {
    return {
      success: false,
      statusCode: 400,
      message: "Reason is required when rejecting",
    };
  }

  try {
    return await sequelize.transaction(async (t) => {
      const directory = await Directory.findByPk(directoryId, {
        transaction: t,
      });

      if (!directory) {
        return {
          success: false,
          statusCode: 404,
          message: "Directory not found",
        };
      }

      if (directory.status === status) {
        return {
          success: false,
          statusCode: 409,
          message: `Directory already ${status}`,
        };
      }

      // Update directory status and optional reason (statusReason column)
      const updateData = { status, reason };
      if (status === "rejected") updateData.reason = reason;
      else updateData.reason = null;

      await directory.update(updateData, { transaction: t });

      // reload fresh data
      await directory.reload({ transaction: t });

      if (directory.userId) {
        const title = `Your Directory is ${status}`;
        const description =
          status === "rejected" ? reason : `Your directory has been ${status}.`;

        await sendNotificationService({
          title,
          description,
          senderId: currentUserId,
          receiverId: directory.userId,
          referenceType: NotificationType.DIRECTORY,
          referenceId: directory.id,
        });
      }

      return { success: true, directory };
    });
  } catch (err) {
    // catch unexpected errors (DB errors etc.) and return error object
    console.error("updateDirectoryStatusService unexpected error:", err);
    return {
      success: false,
      statusCode: 500,
      message: err && err.message ? err.message : "Internal server error",
    };
  }
};
