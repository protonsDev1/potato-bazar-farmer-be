import AdminMarketCoverage from "../../../database/models/adminModels/trader/adminMarketCoverage";
import MarketCoverage from "../../../database/models/trader/marketCoverage";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getRecordById,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addMarketCoverage = async (req, res) => {
  try {
    const response = await createRecord(AdminMarketCoverage, req.body);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Market Coverage with this name already exists.",
      });
    }

    if (response.success) {
      return res.status(201).json({
        message: "Market Coverage created successfully",
        data: response.data,
      });
    }

    return res.status(400).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMarketCoverageById = async (req, res) => {
  try {
    const response = await getRecordById(AdminMarketCoverage, req.params.id);
    if (response.success)
      return res.status(200).json({
        message: "Market Coverage fetched successfully",
        data: response.data,
      });

    return res.status(404).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMarketCoverages = async (req, res) => {
  try {
    const response = await getAllRecords(AdminMarketCoverage);
    if (response.success)
      return res.status(200).json({
        message: "Market Coverage list fetched successfully",
        data: response.data,
      });

    return res.status(400).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getActiveMarketCoverages = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminMarketCoverage);

    if (response.success) {
      return res.status(200).json({
        message: "Market Coverage list fetched successfully",
        data: response.data,
      });
    }

    return res.status(400).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateMarketCoverage = async (req, res) => {
  try {
    const response = await updateRecord(
      AdminMarketCoverage,
      req.params.id,
      req.body,
      "name",
      {
        relatedModel: MarketCoverage,
        targetField: "name",
      }
    );

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Market Coverage with this name already exists.",
      });
    }

    if (response.success) {
      return res.status(200).json({
        message: "Market Coverage updated successfully",
        data: response.data,
      });
    }

    return res.status(404).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteMarketCoverage = async (req, res) => {
  try {
    const response = await deleteRecord(AdminMarketCoverage, req.params.id);
    if (response.success) {
      return res
        .status(200)
        .json({ message: "Market Coverage deleted successfully" });
    }

    return res.status(404).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
