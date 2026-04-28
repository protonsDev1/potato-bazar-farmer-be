import {
  createLiveAuctionService,
  getAllLiveAuctionsForAdminService,
} from "../services/liveAuctionService";
import {
  getMyLiveAuctionsService,
  getPublicLiveAuctionsService,
  getLiveAuctionByIdService,
  updateLiveAuctionService,
  deleteLiveAuctionService,
} from "../services/liveAuctionService";

export const createLiveAuction = async (req, res) => {
  try {
    const result: any = await createLiveAuctionService({
      ...req.body,
      userId: req.user.id,
    });

    if (result?.error) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Auction created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
export const getMyLiveAuctions = async (req, res) => {
  try {
    const data = await getMyLiveAuctionsService(req.user.id, req.query);

    return res.status(200).json({
      success: true,
      message: "My auctions fetched",
      data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublicLiveAuctions = async (req, res) => {
  try {
    const data = await getPublicLiveAuctionsService(req.query);

    return res.status(200).json({
      success: true,
      message: "Auctions fetched",
      data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllLiveAuctionsForAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 10,
      status,
      search,
      state,
      district,
      type, // live | upcoming | completed
    } = req.query;

    const result = await getAllLiveAuctionsForAdminService({
      page: Number(page),
      perPage: Number(perPage),
      status,
      search,
      state,
      district,
      type,
    });

    return res.status(200).json({
      success: true,
      message: "Auctions fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getLiveAuctionById = async (req, res) => {
  try {
    const data = await getLiveAuctionByIdService(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLiveAuction = async (req, res) => {
  try {
    const result = await updateLiveAuctionService(
      req.params.id,
      req.user.id,
      req.body,
    );

    if (result?.error) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Auction updated",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLiveAuction = async (req, res) => {
  try {
    const result = await deleteLiveAuctionService(req.params.id, req.user.id);

    if (result?.error) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Auction deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
