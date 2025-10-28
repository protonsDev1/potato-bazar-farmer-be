import {
  createOrUpdateBannerService,
  getBannerService,
} from "../services/bannerService";

export const createOrUpdateBanner = async (req, res) => {
  try {
    const { text, isActive } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required.",
      });
    }

    const result = await createOrUpdateBannerService(text, isActive);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Error creating/updating banner:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBanner = async (req, res) => {
  try {
    const { isActive } = req.query;

    const onlyActive = isActive === "true";

    const result = await getBannerService(onlyActive);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Error fetching banner:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
