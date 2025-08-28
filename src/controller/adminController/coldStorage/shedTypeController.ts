import AdminShedType from "../../../database/models/adminModels/coldStorage/adminShedType";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addShedType = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(AdminShedType, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Shed Type with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Shed Type added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add Shed Type." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Shed Type.",
    });
  }
};

export const getShedType = async (req, res) => {
  try {
    const response = await getAllRecords(AdminShedType);

    if (response?.success) {
      return res.status(200).json({
        message: "Shed Type fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Shed Type found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Shed Type.",
    });
  }
};

export const getActiveShedType = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminShedType);

    if (response?.success) {
      return res.status(200).json({
        message: "Shed Type fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No active Shed Type found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve active Shed Type.",
    });
  }
};

export const updateShedType = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(AdminShedType, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Shed Type with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Shed Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Shed Type updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Shed Type.",
    });
  }
};

export const deleteShedType = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(AdminShedType, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Shed Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Shed Type deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Shed Type.",
    });
  }
};
