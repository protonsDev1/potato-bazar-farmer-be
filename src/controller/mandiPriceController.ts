import City from "../database/models/city";
import MandiAgent from "../database/models/mandiAgent";
import MandiAllotedToMandiAgent from "../database/models/mandiAllotedToMandiAgent";
import MandiList from "../database/models/mandiList";
import MandiPrice from "../database/models/mandiPrice";
import {
  addMandiPriceService,
  getAllMandiPricesByMandiId,
  getAllMandiPricesService,
  getMandiPriceByIdService,
  getTopMandiPricesService,
  listCitiesWithMandis,
  retrieveDashboardStats,
  updateMandiPriceService,
} from "../services/mandiPriceService";
import { sendMandiNotificationToFarmers } from "../services/notificationService";
import { parseFilters } from "../utils/parseQuery";

export const createMandiPrice = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const response = await addMandiPriceService(req.body, userId);

    if (!response.success)
      return res.status(400).json({ success: false, message: response.error });

    const mandiDetail = await MandiList.findOne({
      where: {
        id: req.body.mandiId,
      },
      include: [
        {
          model: City,
          as: "city",
        },
      ],
    });

    const mandiPriceDate = response.data.mandiPrice.date;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    mandiPriceDate.setHours(0, 0, 0, 0);

    const isPastOrToday = mandiPriceDate <= today;

    if (isPastOrToday) {
      await sendMandiNotificationToFarmers(
        userId,
        response.data?.mandiPrice,
        mandiDetail
      );
    }

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
    const { id: userId } = req.user;

    const filters = parseFilters(req.query);

    const mandiPrices = await getAllMandiPricesService(
      search,
      filters,
      page,
      limit,
      userId
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

export const retrieveAllMandiPricesForMobileUsers = async (req, res) => {
  try {
    const { mandiId } = req.params;

    const filters = parseFilters(req.query);

    const data = await getAllMandiPricesByMandiId(filters, mandiId);

    return res.status(200).json({
      success: true,
      message: "Mandi Price data retrieved successfully.",
      data,
    });
  } catch (error) {
    console.error("Failed to retrieve mandi price data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve mandi price data",
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
    const { id: userId } = req.user;

    const updatedResponse = await updateMandiPriceService(
      req.body,
      mandiPriceId,
      userId
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
    const { id } = req.user;
    const response = await retrieveDashboardStats(id);

    return res.status(200).json({
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

export const getCitiesWithMandisController = async (req, res) => {
  try {
    const allCities = await listCitiesWithMandis();

    return res.status(200).json({
      success: true,
      message: "Cities with mandis retrieved successfully",
      data: allCities,
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

export const retrieveAllMandisAllotedToAgent = async (req, res) => {
  const { id } = req.user;

  try {
    const mandiAgent = await MandiAgent.findOne({
      where: {
        userId: id,
      },
    });

    const allotedMandis = await MandiAllotedToMandiAgent.findAll({
      where: { mandiAgentId: mandiAgent.id },
      include: [
        {
          model: MandiList,
          as: "mandiName",
          include: [
            {
              model: City,
              as: "city",
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      message: "Mandis alloted to agent fetched successfully.",
      data: {
        success: true,
        allotedMandis,
      },
    });
  } catch (error) {
    console.error("Failed to retrieve alloted mandis:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve alloted mandis.",
      error: error.message,
    });
  }
};

export const getTopMandiPrices = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Update lastLogin if token is present
    if (req.user) {
      req.user.lastLogin = new Date();
      await req.user.save();
    }

    const response = await getTopMandiPricesService(pageNum, limitNum);

    return res.status(200).json({
      success: true,
      message: "Top mandi prices retrieved successfully.",
      data: response,
    });
  } catch (error) {
    console.error("Failed to retrieve top mandi prices:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve top mandi prices.",
      error: error.message,
    });
  }
};
