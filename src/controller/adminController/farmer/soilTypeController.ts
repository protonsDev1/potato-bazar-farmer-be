import AdminSoilType from "../../../database/models/adminModels/farmer/adminSoilType";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addSoilType = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(AdminSoilType, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Soil Type with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Soil Type added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add soil type." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add soil type.",
    });
  }
};

export const getSoilType = async (req, res) => {
  try {
    const response = await getAllRecords(AdminSoilType);

    if (response?.success) {
      return res.status(200).json({
        message: "Soil types fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No soil types found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve soil types.",
    });
  }
};

export const getActiveSoilType = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminSoilType);

    if (response?.success) {
      return res.status(200).json({
        message: "Soil types fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No soil types found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve soil types.",
    });
  }
};

export const updateSoilType = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(AdminSoilType, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Soil Type with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Soil Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Soil Type updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update soil type.",
    });
  }
};

export const deleteSoilType = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(AdminSoilType, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Soil Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Soil Type deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete soil type.",
    });
  }
};
