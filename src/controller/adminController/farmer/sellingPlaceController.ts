import AdminSellingPlace from "../../../database/models/adminModels/farmer/adminSellingPlace";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addSellingPlace = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add selling place.",
      });
    }

    const response = await createRecord(AdminSellingPlace, data);

    if (response?.success) {
      return res.status(201).json({
        message: "Selling place added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add selling place." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add selling place.",
    });
  }
};

export const getSellingPlaces = async (req, res) => {
  try {
    const response = await getAllRecords(AdminSellingPlace);

    if (response?.success) {
      return res.status(200).json({
        message: "Selling places fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No selling places found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve selling places.",
    });
  }
};

export const getActiveSellingPlaces = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminSellingPlace);

    if (response?.success) {
      return res.status(200).json({
        message: "Active selling places fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No active selling places found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve selling places.",
    });
  }
};

export const updateSellingPlace = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update selling places.",
      });
    }

    const response = await updateRecord(AdminSellingPlace, id, data);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Selling place not found.",
      });
    }

    return res.status(200).json({
      message: "Selling place updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update selling place.",
    });
  }
};

export const deleteSellingPlace = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete selling places.",
      });
    }

    const response = await deleteRecord(AdminSellingPlace, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Selling place not found.",
      });
    }

    return res.status(200).json({
      message: "Selling place deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete selling place.",
    });
  }
};
