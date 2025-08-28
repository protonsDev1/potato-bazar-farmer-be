import AdminRoofType from "../../../database/models/adminModels/coldStorage/adminRoofType";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addRoofType = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(AdminRoofType, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Roof Type with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Roof Type added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add Roof Type." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Roof Type.",
    });
  }
};

export const getRoofType = async (req, res) => {
  try {
    const response = await getAllRecords(AdminRoofType);

    if (response?.success) {
      return res.status(200).json({
        message: "Roof Type fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Roof Type found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Roof Type.",
    });
  }
};

export const getActiveRoofType = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminRoofType);

    if (response?.success) {
      return res.status(200).json({
        message: "Roof Type fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No active Roof Type found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve active Roof Type.",
    });
  }
};

export const updateRoofType = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(AdminRoofType, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Roof Type with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Roof Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Roof Type updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Roof Type.",
    });
  }
};

export const deleteRoofType = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(AdminRoofType, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Roof Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Roof Type deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Roof Type.",
    });
  }
};
