import AdminStorageFeature from "../../../database/models/adminModels/coldStorage/adminStorageFeature";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addStorageFeature = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add Storage Feature.",
      });
    }

    const response = await createRecord(AdminStorageFeature, data);

    if (response?.success) {
      return res.status(201).json({
        message: "New Storage Feature added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add Storage Feature." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Storage Feature.",
    });
  }
};

export const getStorageFeature = async (req, res) => {
  try {
    const response = await getAllRecords(AdminStorageFeature);

    if (response?.success) {
      return res.status(200).json({
        message: "Storage Feature fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Storage Feature found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Storage Feature.",
    });
  }
};

export const getActiveStorageFeature = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminStorageFeature);

    if (response?.success) {
      return res.status(200).json({
        message: "Storage Feature fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No active Storage Feature found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve active Storage Feature.",
    });
  }
};

export const updateStorageFeature = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update Storage Feature.",
      });
    }

    const response = await updateRecord(AdminStorageFeature, id, data);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Storage Feature record not found.",
      });
    }

    return res.status(200).json({
      message: "Storage Feature updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Storage Feature.",
    });
  }
};

export const deleteStorageFeature = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete Storage Feature.",
      });
    }

    const response = await deleteRecord(AdminStorageFeature, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Storage Feature record not found.",
      });
    }

    return res.status(200).json({
      message: "Storage Feature deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Storage Feature.",
    });
  }
};
