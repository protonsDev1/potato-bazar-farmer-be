import AdminStorageType from "../../../database/models/adminModels/coldStorage/adminStorageType";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addStorageType = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add storage types.",
      });
    }

    const response = await createRecord(AdminStorageType, data);

    if (response?.success) {
      return res.status(201).json({
        message: "New Storage Type added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add storage type." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add storage type.",
    });
  }
};

export const getStorageType = async (req, res) => {
  try {
    const response = await getAllRecords(AdminStorageType);

    if (response?.success) {
      return res.status(200).json({
        message: "Storage types fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No storage types found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve storage types.",
    });
  }
};

export const getActiveStorageType = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminStorageType);

    if (response?.success) {
      return res.status(200).json({
        message: "Storage types fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No storage types found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve storage types.",
    });
  }
};

export const updateStorageType = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update storage types.",
      });
    }

    const response = await updateRecord(AdminStorageType, id, data);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Storage Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Storage Type updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update storage type.",
    });
  }
};

export const deleteStorageType = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete storage types.",
      });
    }

    const response = await deleteRecord(AdminStorageType, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Storage Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Storage Type deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete storage type.",
    });
  }
};
