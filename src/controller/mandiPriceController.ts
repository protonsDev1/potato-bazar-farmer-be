import MandiPrice from "../database/models/mandiPrice";
import {
  addMandiPriceService,
  getAllMandiPricesService,
  getMandiPriceByIdService,
  listCitiesWithMandis,
  retrieveDashboardStats,
  updateMandiPriceService,
} from "../services/mandiPriceService";
import { parseFilters } from "../utils/parseQuery";

export const createMandiPrice = async (req, res) => {
  try {
    const response = await addMandiPriceService(req.body);

    if (!response.success)
      return res.status(400).json({ success: false, message: response.error });

    return res.status(201).json({
      success: true,
      message: "Mandi Price is created successfully.",
      data: response.data,
    });
  } catch (error) {
    console.error("Failed to create mandi prices:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create mandi prices",
      error: error.message,
    });
  }
};

export const retrieveAllMandiPrices = async (req, res) => {
  try {
    const { search, page, perPage: limit } = req.query;

    const filters = parseFilters(req.query);

    const mandiPrices = await getAllMandiPricesService(
      search,
      filters,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      message: "All mandi Prices retrieved successfully.",
      mandiPrices,
    });
  } catch (error) {
    console.error("Failed to retrieve all mandi prices:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve all mandi prices",
      error: error.message,
    });
  }
};

export const retrieveMandiPriceById = async (req, res) => {
  try {
    const { mandiPriceId } = req.params;

    const mandiPriceDetail = await getMandiPriceByIdService(mandiPriceId);

    return res.status(200).json({
      success: true,
      message: "Mandi Price detail retrieved successfully.",
      data: mandiPriceDetail.data,
    });
  } catch (error) {
    console.error("Failed to retrieve mandi price detail:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve mandi price detail",
      error: error.message,
    });
  }
};

export const updateMandiPrice = async (req, res) => {
  try {
    const { mandiPriceId } = req.params;

    const updatedResponse = await updateMandiPriceService(
      req.body,
      mandiPriceId
    );

    if (!updatedResponse.success)
      return res
        .status(400)
        .json({ success: false, message: updatedResponse.error });

    return res.status(200).json({
      success: true,
      message: "Mandi Price updated successfully.",
      data: updatedResponse.data,
    });
  } catch (error) {
    console.error("Failed to update mandi prices:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update mandi prices",
      error: error.message,
    });
  }
};

export const deleteMandiPrice = async (req, res) => {
  try {
    const { mandiPriceId } = req.params;

    const mandiPrice = await MandiPrice.findOne({
      where: { id: mandiPriceId },
    });

    if (!mandiPrice)
      return res.status(400).json({
        success: false,
        message: "Mandi Price Record not found.",
      });

    await MandiPrice.destroy({ where: { id: mandiPriceId } });

    return res
      .status(200)
      .json({ message: "Mandi Price deleted successfully." });
  } catch (error) {
    console.error("Failed to delete mandi prices:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete mandi prices",
      error: error.message,
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const response = await retrieveDashboardStats();

    return res
      .status(200)
      .json({
        success: true,
        message: "Dashboard Staticts retrieved successfully",
        data: response,
      });
  } catch (error) {
    console.error("Failed to retrieve dashboard statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard statistics.",
      error: error.message,
    });
  }
};

export const getCitiesWithMandisController = async (req, res ) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const allCities = await listCitiesWithMandis(page,limit);

   

    return res.status(200).json({
      success: true,
      message: "Cities with mandis retrieved successfully",
      page,
      limit,
      data: allCities
    });
  } catch (error: any) {
    console.error("Failed to retrieve cities with mandis:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve cities with mandis.",
      error: error.message,
    });
  }
};
