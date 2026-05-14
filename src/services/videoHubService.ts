import { Op } from "sequelize";
import VideoHub from "../database/models/videoHub";
import VideoHubCategory from "../database/models/videoHubCategory";

export const createVideoHubService = async (payload) => {
  const video = await VideoHub.create(payload);

  return {
    success: true,
    statusCode: 201,
    message: "Video hub created successfully",
    data: video,
  };
};

export const listVideoHubsService = async ({ page = 1, limit = 10, categoryId, status, language, isFeatured }) => {
  const whereClause: any = {};

  if (categoryId) {
    whereClause.categoryId = categoryId;
  }
  if (status) {
    whereClause.status = status;
  }
  if (language) {
    whereClause.language = language;
  }
  if (isFeatured !== undefined) {
    whereClause.isFeatured = isFeatured === 'true' || isFeatured === true;
  }

  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await VideoHub.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: VideoHubCategory,
        as: "category",
      },
    ],
    offset,
    limit: Number(limit),
    order: [["createdAt", "DESC"]],
  });

  return {
    success: true,
    statusCode: 200,
    message: "Video hubs fetched successfully",
    data: {
      total: count,
      page: Number(page),
      perPage: Number(limit),
      videos: rows,
    },
  };
};

export const getVideoHubByIdService = async (id) => {
  const video = await VideoHub.findByPk(id, {
    include: [
      {
        model: VideoHubCategory,
        as: "category",
      },
    ],
  });

  if (!video) {
    return {
      success: false,
      statusCode: 404,
      message: "Video hub not found",
    };
  }

  return {
    success: true,
    statusCode: 200,
    message: "Video hub fetched successfully",
    data: video,
  };
};

export const updateVideoHubService = async (id, payload) => {
  const video = await VideoHub.findByPk(id);
  if (!video) {
    return {
      success: false,
      statusCode: 404,
      message: "Video hub not found",
    };
  }

  await video.update(payload);

  return {
    success: true,
    statusCode: 200,
    message: "Video hub updated successfully",
    data: video,
  };
};

export const deleteVideoHubService = async (id) => {
  const video = await VideoHub.findByPk(id);
  if (!video) {
    return {
      success: false,
      statusCode: 404,
      message: "Video hub not found",
    };
  }

  await video.destroy();
  
  return {
    success: true,
    statusCode: 200,
    message: "Video hub deleted successfully",
  };
};

export const createVideoHubCategoryService = async (payload) => {
  const category = await VideoHubCategory.create(payload);

  return {
    success: true,
    statusCode: 201,
    message: "Video hub category created successfully",
    data: category,
  };
};

export const listVideoHubCategoriesService = async ({ page = 1, limit = 10 }) => {

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const offset = (pageNumber - 1) * limitNumber;

  const { rows, count } = await VideoHubCategory.findAndCountAll({
    offset,
    limit: limitNumber,
    order: [["createdAt", "DESC"]],
  });

  return {
    success: true,
    statusCode: 200,
    message: "Video hub categories fetched successfully",
    data: {
      total: count,
      page: pageNumber,
      perPage: limitNumber,
      categories: rows,
    },
  };
};

export const deleteVideoHubCategoryService = async (id) => {
  const category = await VideoHubCategory.findByPk(id);
  if (!category) {
    return {
      success: false,
      statusCode: 404,
      message: "Video hub category not found",
    };
  }

  await category.destroy();
  
  return {
    success: true,
    statusCode: 200,
    message: "Video hub category deleted successfully",
  };
};
