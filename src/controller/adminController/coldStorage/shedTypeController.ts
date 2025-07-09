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
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add Shed Type.",
      });
    }

    const response = await createRecord(AdminShedType, data);

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
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update Shed Type.",
      });
    }

    const response = await updateRecord(AdminShedType, id, data);

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
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete Shed Type.",
      });
    }

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
