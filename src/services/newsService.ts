import { Op } from "sequelize";
import News from "../database/models/news";
import { USER_ROLES } from "../database/models/user";
import State from "../database/models/state";
import District from "../database/models/district";
import NewsView from "../database/models/newsView";

export const createNewsService = async (payload) => {
  const news = await News.create(payload);
  return {
    success: true,
    statusCode: 201,
    message: "News created successfully",
    data: news,
  };
};

export const listNewsService = async ({
  search,
  page,
  limit,
  category,
  status,
  isFeatured,
  stateId,
  districtId,
  date
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
  if (isFeatured === "true") whereClause.isFeatured = true;
  if (stateId) whereClause.stateId = stateId;
  if (districtId) whereClause.districtId = districtId;

  const offset = (page - 1) * limit;

  // Fetch paginated records (sorted latest first)
  const { rows, count } = await News.findAndCountAll({
    where: whereClause,
    include: [
      { model: State, as: "state", attributes: ["id", "name"] },
      { model: District, as: "district", attributes: ["id", "name"] },
    ],
    offset,
    limit,
    order: [["updatedAt", "DESC"]],
  });

  // Fetch ALL records separately for latest 2 selection
  const allNews = await News.findAll({
    where: whereClause,
    order: [["createdAt", "DESC"]],
  });

  // Take top latest 2 records
  const latestTwoNews = allNews.slice(0, 2);

  const newsWithViews = await Promise.all(
    rows.map(async (news) => {
      const views = await NewsView.count({ where: { newsId: news.id } });
      return { ...news.toJSON(), views };
    })
  );

  const latestTwoWithViews = await Promise.all(
    latestTwoNews.map(async (news) => {
      const views = await NewsView.count({ where: { newsId: news.id } });
      return { ...news.toJSON(), views };
    })
  );

  return {
    success: true,
    statusCode: 200,
    message: "News fetched successfully",
    data: {
      total: count,
      page,
      perPage: limit,
      news: newsWithViews,
      latestTwoNews: latestTwoWithViews, // ✅ added
    },
  };
};


export const getNewsByIdService = async (id, user) => {
  const news = await News.findOne({
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

  if (!news) {
    return {
      success: false,
      statusCode: 404,
      message: "News not found",
    };
  }

  if (user && user.role !== USER_ROLES.SUPER_ADMIN) {
    await NewsView.findOrCreate({
      where: { userId: user.id, newsId: id },
      defaults: { userId: user.id, newsId: id },
    });
  }

  const viewCount = await NewsView.count({ where: { newsId: id } });

  const relatedNews = await News.findAll({
    where: {
      id: { [Op.ne]: news.id },
      [Op.or]: [
        { category: news.category },
        { tags: { [Op.overlap]: news.tags } },
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

  return {
    success: true,
    statusCode: 200,
    message: "News fetched successfully",
    data: {
      news: { ...news.toJSON(), views: viewCount },
      relatedNews,
    },
  };
};

export const updateNewsService = async (id, payload) => {
  const news = await News.findByPk(id);
  if (!news) {
    return {
      success: false,
      statusCode: 404,
      message: "News not found",
    };
  }
  await news.update(payload);
  return {
    success: true,
    statusCode: 200,
    message: "News updated successfully",
    data: news,
  };
};

export const deleteNewsService = async (id) => {
  const news = await News.findByPk(id);
  if (!news) {
    return {
      success: false,
      statusCode: 404,
      message: "News not found",
    };
  }
  await news.destroy();
  return {
    success: true,
    statusCode: 200,
    message: "News deleted successfully",
  };
};
