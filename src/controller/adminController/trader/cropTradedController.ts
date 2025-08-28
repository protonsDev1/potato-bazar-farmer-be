import AdminCropTraded from "../../../database/models/adminModels/trader/adminCropTraded";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getRecordById,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addCropTraded = async (req, res) => {
  try {
    const response = await createRecord(AdminCropTraded, req.body);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Crop Traded with this name already exists.",
      });
    }

    if (response.success) {
      return res.status(201).json({
        message: "Crop Traded created successfully",
        data: response.data,
      });
    }

    return res.status(400).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCropTradedById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getRecordById(AdminCropTraded, id);
    if (response.success) {
      return res.status(200).json({
        message: "Crop Traded fetched successfully",
        data: response.data,
      });
    }

    return res.status(404).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCropsTraded = async (req, res) => {
  try {
    const response = await getAllRecords(AdminCropTraded);
    if (response.success) {
      return res.status(200).json({
        message: "Crop Traded list fetched successfully",
        data: response.data,
      });
    }

    return res.status(400).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getActiveCropsTraded = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminCropTraded);

    if (response.success) {
      return res.status(200).json({
        message: "Crop Traded list fetched successfully",
        data: response.data,
      });
    }

    return res.status(400).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCropTraded = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await updateRecord(AdminCropTraded, id, req.body);
    if (response?.duplicate) {
      return res.status(409).json({
        message: "Crop Traded with this name already exists.",
      });
    }
    if (response.success) {
      return res.status(200).json({
        message: "Crop Traded updated successfully",
        data: response.data,
      });
    }

    return res.status(404).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCropTraded = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteRecord(AdminCropTraded, id);
    if (response.success) {
      return res
        .status(200)
        .json({ message: "Crop Traded deleted successfully" });
    }

    return res.status(404).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
