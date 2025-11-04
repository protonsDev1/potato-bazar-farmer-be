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

export async function onboardDirectory(payload) {
  try {
    return await sequelize.transaction(async (t) => {
      const directory = await Directory.create(
        { ...payload },
        { transaction: t }
      );

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

      if (payload.categoryMappings) {
        const records = payload.categoryMappings.map((m) => ({
          directoryId: directory.id,
          ...m,
        }));
        await DirectoryCategoryMapping.bulkCreate(records, { transaction: t });
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

    await directory.update(payload, { transaction: t });

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

    if (payload.categoryMappings) {
      await DirectoryCategoryMapping.destroy({
        where: { directoryId },
        transaction: t,
      });
      const records = payload.categoryMappings.map((m) => ({
        directoryId,
        ...m,
      }));
      await DirectoryCategoryMapping.bulkCreate(records, { transaction: t });
    }

    return directory;
  });
}

export const retrieveDirectoryProfile = async (directoryId) => {
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

    return {
      info,
      socialMedia,
      media,
      categoryMappings,
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
  sortBy?
) => {
  try {
    const offset = (page - 1) * limit;
    const whereCondition: any = {};

    const {
      state,
      city,
      registrationDate,
      onboardedByUser,
      status,
      categoryId,
      subCategoryId,
    } = filters;

    if (status) whereCondition.status = status;
    if (state && state.toLowerCase() !== "all")
      whereCondition.state = { [Op.iLike]: state };
    if (city && city.toLowerCase() !== "all")
      whereCondition.city = { [Op.iLike]: city };

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
      if (onboardedByUser === "self")
        onBoardedByUserWhere.role = USER_ROLES.USER;
      else if (onboardedByUser === "super_admin")
        onBoardedByUserWhere.role = USER_ROLES.SUPER_ADMIN;
    }

    if (search?.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereCondition[Op.or] = [
        { id: isNaN(Number(search)) ? -1 : Number(search) },
        { companyName: { [Op.iLike]: searchTerm } },
        { contactPersonName: { [Op.iLike]: searchTerm } },
        { email: { [Op.iLike]: searchTerm } },
      ];
    }

    let order: any = [["updatedAt", "DESC"]];
    if (sortBy) {
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
          order = [["updatedAt", "DESC"]];
      }
    }

    const { count, rows } = await Directory.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order,
      distinct: true,
      include: [
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
      ],
    });

    return {
      totalCount: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      directories: rows,
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

export const validateCategoryMappingsPayload = (categoryMappings) => {
  if (!Array.isArray(categoryMappings) || categoryMappings.length === 0)
    return { ok: true };

  // normalize and check duplicates
  const seen = new Map(); // key => { count, original }
  for (const m of categoryMappings) {
    const categoryId = Number(m.categoryId);
    const subId = m.subCategoryId == null ? null : Number(m.subCategoryId);

    if (Number.isNaN(categoryId)) {
      return { ok: false, message: "Invalid categoryId in categoryMappings" };
    }

    const key = `${categoryId}|${subId === null ? "null" : subId}`;
    const pairKey = `${categoryId}`; // used to detect pair-level conflicts (null vs non-null)

    // duplicate exact pair?
    if (seen.has(key)) {
      return {
        ok: false,
        message: `Duplicate category mapping found for categoryId=${categoryId} and subCategoryId=${subId}`,
      };
    }
    seen.set(key, (seen.get(key) || 0) + 1);

    // check conflict: same categoryId appears once with subCategoryId=null and once with concrete subCategoryId
    // track whether we've seen null / non-null for a category
    const existing = seen.get(pairKey);
    if (existing && typeof existing === "object") {
      // already stored conflict detection info (we won't reach here with this map shape unless we set it below)
    } else {
      // use separate map to track null/non-null per category
    }
  }

  // Second pass to detect category-level conflicts (null vs non-null)
  const byCategory = new Map();
  for (const m of categoryMappings) {
    const categoryId = Number(m.categoryId);
    const subId = m.subCategoryId == null ? null : Number(m.subCategoryId);
    const state = byCategory.get(categoryId) || {
      hasNull: false,
      nonNullCount: 0,
    };

    if (subId === null) state.hasNull = true;
    else state.nonNullCount += 1;

    byCategory.set(categoryId, state);
  }

  for (const [cat, state] of byCategory) {
    if (state.hasNull && state.nonNullCount > 0) {
      // This is a potential conflict for DB partial-unique strategy:
      // (directoryId, categoryId) unique when subCategoryId IS NULL
      return {
        ok: false,
        message: `Conflicting mappings for categoryId=${cat}: payload contains both a null subCategoryId and one or more non-null subCategoryId. Resolve this and retry.`,
      };
    }
  }

  return { ok: true };
};
