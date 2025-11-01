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
  date,
}) => {
  const whereClause: any = {};

  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { tags: { [Op.contains]: [search] } },
    ];
  }

  if (category) {
    whereClause.category = category;
  }

  if (status) {
    whereClause.status = status;
  }

  if (isFeatured && isFeatured === "true") {
    whereClause.isFeatured = true;
  }

  if (stateId) whereClause.stateId = stateId;

  if (districtId) whereClause.districtId = districtId;

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    whereClause.createdAt = { [Op.between]: [start, end] };
  }

  const offset = (page - 1) * limit;

  const { rows, count } = await News.findAndCountAll({
    where: whereClause,
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
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  const newsWithViews = await Promise.all(
    rows.map(async (news) => {
      const viewCount = await NewsView.count({ where: { newsId: news.id } });
      return { ...news.toJSON(), views: viewCount };
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
