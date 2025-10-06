import Banner from "../database/models/banner";

export const createOrUpdateBannerService = async (
  text?: string,
  isActive?: boolean
) => {
  const existingBanner = await Banner.findOne();

  if (existingBanner) {
    if (text !== undefined) existingBanner.text = text;
    if (isActive !== undefined) existingBanner.isActive = isActive;

    await existingBanner.save();

    return {
      statusCode: 200,
      success: true,
      message: "Banner updated successfully.",
      data: existingBanner,
    };
  }

  const newBanner = await Banner.create({ text, isActive });

  return {
    statusCode: 201,
    success: true,
    message: "Banner created successfully.",
    data: newBanner,
  };
};

export const getBannerService = async (onlyActive?: boolean) => {
  const whereCondition: any = {};

  if (onlyActive) {
    whereCondition.isActive = true;
  }

  const banner = await Banner.findOne({ where: whereCondition });

  if (!banner) {
    return {
      statusCode: 404,
      success: false,
      message: "No banner found.",
    };
  }

  return {
    statusCode: 200,
    success: true,
    message: "Banner retrieved successfully.",
    data: banner,
  };
};
