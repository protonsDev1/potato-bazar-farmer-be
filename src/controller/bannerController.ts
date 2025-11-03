import {
  createBannerService,
  getAllBannersService,
  getBannerByIdService,
  updateBannerService,
  deleteBannerService,
  getPublicBannersService,
} from "../services/bannerService";

export const createBanner = async (req, res) => {
  try {
    const result = await createBannerService(req.body);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBanners = async (req, res) => {
  try {
    const result = await getAllBannersService(req.query);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBannerById = async (req, res) => {
  try {
    const result = await getBannerByIdService(Number(req.params.id));
    return res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const result = await updateBannerService(Number(req.params.id), req.body);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const result = await deleteBannerService(Number(req.params.id));
    return res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublicBanners = async (req, res) => {
  try {
    const result = await getPublicBannersService();
    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Error fetching public banners:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
