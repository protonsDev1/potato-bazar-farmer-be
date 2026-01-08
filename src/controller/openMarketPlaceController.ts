import OpenMarketPlace from "../database/models/openMarketPlace";
import {
  createOpenMarketPlaceService,
  getOpenMarketPlacesService,
} from "../services/openMarketPlaceService";
import { parseFilters } from "../utils/parseQuery";

export const createOpenMarketPlace = async (req, res) => {
  try {
    const { id: userId } = req.user;

    req.body.createdBy = userId;

    const response = await createOpenMarketPlaceService(req.body);

    return res.status(201).json({
      success: true,
      message: "Open Market Places created successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in creating open market place.",
    });
  }
};

export const getOpenMarketPlacesListing = async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 10,
      category
    } = req.query;
    const { id: userId } = req.user;

     const filters = parseFilters(req.query);
    

    const response = await getOpenMarketPlacesService(
      userId,
      page,
      perPage,
      filters,
      category,
    );

    return res.status(200).json({
      success: true,
      message: "Retrived open market places successfully.",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in retrieving open market places.",
    });
  }
};

export const getOpenMarketPlaceById = async (req, res) => {
  try {
    const response = await OpenMarketPlace.findByPk(req.params.id);
    if (!response)
      return res.status(404).json({
        success: false,
        message: "Open Market Place record not found.",
      });

    return res.status(200).json({
      success: true,
      message: "Retrieved open market place detail page successfully.",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Error in retrieving open market place detail page.",
    });
  }
};

export const updateStatusForOpenMarketPlace = async (req, res) => {
  try {
    const { status, id } = req.body;

    const response = await OpenMarketPlace.findByPk(id);
    if (!response)
      return res.status(404).json({
        success: false,
        message: "Open Market Place record not found.",
      });

    await OpenMarketPlace.update({ status }, { where: { id } });

    return res.status(200).json({
      success: true,
      message: `Open Market Place has been successfully ${status}.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Error in updating status for open market place.",
    });
  }
};

export const deleteOpenMarketPlace = async (req, res) => {
  try {
    const record = await OpenMarketPlace.findByPk(req.params.id);
    if (!record)
      return res.status(404).json({
        success: false,
        message: "Open Market Place record not found.",
      });

    await record.destroy();

    return res
      .status(200)
      .json({
        success: true,
        message: "Open Market Place record deleted successfully.",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in deleting open market place.",
    });
  }
};
