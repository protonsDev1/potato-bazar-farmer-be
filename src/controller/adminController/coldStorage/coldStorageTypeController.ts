import AdminColdStorageType from "../../../database/models/adminModels/coldStorage/adminColdStorageType";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addColdStorageType = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(AdminColdStorageType, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Cold Storage Type with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Cold Storage Type added successfully.",
        data: response.data,
      });
    }

    return res
      .status(400)
      .json({ message: "Failed to add Cold Storage Type." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Cold Storage Type.",
    });
  }
};

export const getColdStorageType = async (req, res) => {
  try {
    const response = await getAllRecords(AdminColdStorageType);

    if (response?.success) {
      return res.status(200).json({
        message: "Cold Storage Type fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Cold Storage Type found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Cold Storage Type.",
    });
  }
};

export const getActiveColdStorageType = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminColdStorageType);

    if (response?.success) {
      return res.status(200).json({
        message: "Active Cold Storage Type fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No active Cold Storage Type found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve active Cold Storage Type.",
    });
  }
};

export const updateColdStorageType = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(AdminColdStorageType, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Cold Storage Type with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Cold Storage Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Cold Storage Type updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Cold Storage Type.",
    });
  }
};

export const deleteColdStorageType = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(AdminColdStorageType, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Cold Storage Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Cold Storage Type deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Cold Storage Type.",
    });
  }
};
