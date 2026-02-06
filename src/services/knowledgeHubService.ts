import { Op } from "sequelize";
import { USER_ROLES } from "../database/models/user";
import State from "../database/models/state";
import District from "../database/models/district";
import KnowledgeHub from "../database/models/knowledgeHub";
import KnowledgeHubView from "../database/models/knowledgeHubView";
import { generateTranslationsForRecord } from "../utils/translation";
import { getThumbnailUrl } from "../utils/commonCode";

export const createKnowledgeHubService = async (payload) => {
  const knowledgeHub = await KnowledgeHub.create(payload);

  try {
    await generateTranslationsForRecord(knowledgeHub, {
      recordId: knowledgeHub.id,
      recordType: "KnowledgeHub",
      fields: ["title", "description", "category", "source"],
      arrayFields: ["tags"],
      dateFields: [{ key: "createdAt" }],
    });
  } catch (err: any) {
    console.error(
      `[KnowledgeHub ${knowledgeHub.id}] Translation error:`,
      err?.message || err,
    );
  }

  return {
    success: true,
    statusCode: 201,
    message: "Knowledge Hub created successfully",
    data: knowledgeHub,
  };
};

export const listKnowledgeHubService = async ({
  search,
  page,
  limit,
  category,
  status,
  isFeatured,
  stateId,
  districtId,
  date,
}) => {
  const whereClause: any = {};

  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { tags: { [Op.contains]: [search] } },
    ];
  }

  if (category) whereClause.category = category;
  if (status) whereClause.status = status;
  if (isFeatured && isFeatured === "true") whereClause.isFeatured = true;
  if (stateId) whereClause.stateId = stateId;
  if (districtId) whereClause.districtId = districtId;
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    whereClause.createdAt = { [Op.between]: [start, end] };
  }

  const offset = (page - 1) * limit;

  // Fetch paginated records (sorted latest first)
  const { rows, count } = await KnowledgeHub.findAndCountAll({
    where: whereClause,
    include: [
      { model: State, as: "state", attributes: ["id", "name"] },
      { model: District, as: "district", attributes: ["id", "name"] },
    ],
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  const knowledgeHubWithViews = await Promise.all(
    rows.map(async (hub) => {
      const views = await KnowledgeHubView.count({
        where: { knowledgeHubId: hub.id },
      });
      const json = hub.toJSON();

      const thumbnailUrls = (json.images || []).map(getThumbnailUrl);

      return {
        ...json,
        views,
        thumbnailUrls,
      };
    }),
  );

  return {
    success: true,
    statusCode: 200,
    message: "Knowledge Hubs fetched successfully",
    data: {
      total: count,
      page,
      perPage: limit,
      knowledgeHubs: knowledgeHubWithViews,
    },
  };
};

export const getKnowledgeHubsByIdService = async (id, user) => {
  const knowledgeHub = await KnowledgeHub.findOne({
    where: { id },
    include: [
      {
        model: State,
        as: "state",
        attributes: ["id", "name"],
      },
      {
        model: District,
        as: "district",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!knowledgeHub) {
    return {
      success: false,
      statusCode: 404,
      message: "Knowledge Hubs not found",
    };
  }

  if (user && user.role !== USER_ROLES.SUPER_ADMIN) {
    await KnowledgeHubView.findOrCreate({
      where: { userId: user.id, knowledgeHubId: id },
      defaults: { userId: user.id, knowledgeHubId: id },
    });
  }

  const viewCount = await KnowledgeHubView.count({
    where: { knowledgeHubId: id },
  });

  const knowledgeHubJson = knowledgeHub.toJSON();
  const thumbnailUrls = (knowledgeHubJson.images || []).map(getThumbnailUrl);

  const relatedKnowledgeHubs = await KnowledgeHub.findAll({
    where: {
      id: { [Op.ne]: knowledgeHub.id },
      [Op.or]: [
        { category: knowledgeHub.category },
        { tags: { [Op.overlap]: knowledgeHub?.tags } },
      ],
    },
    include: [
      {
        model: State,
        as: "state",
        attributes: ["id", "name"],
      },
      {
        model: District,
        as: "district",
        attributes: ["id", "name"],
      },
    ],
    limit: 5,
  });

  const relatedKnowledgeHubsWithThumbs = relatedKnowledgeHubs.map((item) => {
    const json = item.toJSON();
    return {
      ...json,
      thumbnailUrls: (json.images || []).map(getThumbnailUrl),
    };
  });

  return {
    success: true,
    statusCode: 200,
    message: "Knowledge Hubs fetched successfully",
    data: {
      news: { ...knowledgeHub.toJSON(), views: viewCount, thumbnailUrls },
      relatedKnowledgeHubsWithThumbs,
    },
  };
};

export const updateKnowledgeHubService = async (id, payload) => {
  const knowledgeHub = await KnowledgeHub.findByPk(id);
  if (!knowledgeHub) {
    return {
      success: false,
      statusCode: 404,
      message: "Knowledge Hub not found",
    };
  }
  await knowledgeHub.update(payload);

  try {
    await generateTranslationsForRecord(knowledgeHub, {
      recordId: knowledgeHub.id,
      recordType: "KnowledgeHub",
      fields: ["title", "description", "category", "source"],
      arrayFields: ["tags"],
      dateFields: [{ key: "createdAt" }],
    });
  } catch (err: any) {
    console.error(
      `[KnowledgeHub ${knowledgeHub.id}] Translation error on update:`,
      err?.message || err,
    );
  }

  return {
    success: true,
    statusCode: 200,
    message: "Knowledge Hub updated successfully",
    data: knowledgeHub,
  };
};

export const deleteKnowledgeHubService = async (id) => {
  const knowledgeHub = await KnowledgeHub.findByPk(id);
  if (!knowledgeHub) {
    return {
      success: false,
      statusCode: 404,
      message: "Knowledge Hub not found",
    };
  }
  await knowledgeHub.destroy();
  return {
    success: true,
    statusCode: 200,
    message: "Knowledge Hub deleted successfully",
  };
};
