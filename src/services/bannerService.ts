import { Op } from "sequelize";
import Banner from "../database/models/banner";
import Event from "../database/models/event";

export const createBannerService = async (payload) => {
  const banner = await Banner.create(payload);
  return {
    statusCode: 201,
    success: true,
    message: "Banner created successfully.",
    data: banner,
  };
};

export const getAllBannersService = async (query) => {
  const {
    page = 1,
    perPage: limit = 10,
    search = "",
    isActive,
    hasEvent,
  } = query;

  const offset = (Number(page) - 1) * Number(limit);

  const where: any = {};

  if (isActive === "true") where.isActive = true;

  if (hasEvent === "true") {
    where.eventId = { [Op.ne]: null };
  } else if (hasEvent === "false") {
    where.eventId = null;
  }

  if (search) {
    where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }];
  }

  const { rows: banners, count: total } = await Banner.findAndCountAll({
    where,
    include: [
      {
        model: Event,
        as: "event",
      },
    ],
    order: [["position", "ASC"]],
    limit: Number(limit),
    offset,
  });

  return {
    statusCode: 200,
    success: true,
    message: "Banners fetched successfully.",
    data: banners,
    pagination: {
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  };
};

export const getBannerByIdService = async (id: number) => {
  const banner = await Banner.findByPk(id);
  if (!banner)
    return { statusCode: 404, success: false, message: "Banner not found." };

  return {
    statusCode: 200,
    success: true,
    message: "Banner found.",
    data: banner,
  };
};

export const updateBannerService = async (id: number, payload: any) => {
  const banner = await Banner.findByPk(id);
  if (!banner)
    return { statusCode: 404, success: false, message: "Banner not found." };

  await banner.update(payload);
  return {
    statusCode: 200,
    success: true,
    message: "Banner updated successfully.",
    data: banner,
  };
};

export const deleteBannerService = async (id: number) => {
  const banner = await Banner.findByPk(id);
  if (!banner)
    return { statusCode: 404, success: false, message: "Banner not found." };

  await banner.destroy();
  return {
    statusCode: 200,
    success: true,
    message: "Banner deleted successfully.",
  };
};

export const getPublicBannersService = async () => {
  const today = new Date();

  const dateFilter = {
    isActive: true,
    [Op.or]: [
      {
        startDate: { [Op.lte]: today },
        endDate: { [Op.gte]: today },
      },
      {
        startDate: null,
        endDate: null,
      },
    ],
  };

  // Promotional banners
  const promotionalBanners = await Banner.findAll({
    where: {
      ...dateFilter,
      eventId: null,
    },
    order: [
      ["position", "ASC"],
      ["createdAt", "DESC"],
    ],
    limit: 3,
  });

  // Event banners
  const eventBanners = await Banner.findAll({
    where: {
      ...dateFilter,
      eventId: { [Op.ne]: null },
    },
    include: [
      {
        model: Event,
        as: "event",
      },
    ],
    order: [
      [{ model: Event, as: "event" }, "startDate", "ASC"],
      [{ model: Event, as: "event" }, "endDate", "ASC"],
    ],
    limit: 3,
  });

  return {
    statusCode: 200,
    success: true,
    message: "Public banners fetched successfully.",
    promotionalBanners,
    eventBanners,
  };
};
