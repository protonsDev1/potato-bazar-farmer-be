import AdminUsageType from "../../../database/models/adminModels/coldStorage/adminUsageType";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addUsageType = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add usage types.",
      });
    }

    const response = await createRecord(AdminUsageType, data);

    if (response?.success) {
      return res.status(201).json({
        message: "New Usage Type added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add usage type." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add usage type.",
    });
  }
};

export const getUsageType = async (req, res) => {
  try {
    const response = await getAllRecords(AdminUsageType);

    if (response?.success) {
      return res.status(200).json({
        message: "Usage types fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No usage types found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve usage types.",
    });
  }
};

export const getActiveUsageType = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminUsageType);

    if (response?.success) {
      return res.status(200).json({
        message: "Usage types fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No usage types found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve usage types.",
    });
  }
};

export const updateUsageType = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update usage types.",
      });
    }

    const response = await updateRecord(AdminUsageType, id, data);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Usage Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Usage Type updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update usage type.",
    });
  }
};

export const deleteUsageType = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete usage types.",
      });
    }

    const response = await deleteRecord(AdminUsageType, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Usage Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Usage Type deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete usage type.",
    });
  }
};
