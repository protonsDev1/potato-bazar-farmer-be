import AdminSowingMethod from "../../../database/models/adminModels/farmer/adminSowingMethod";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addSowingMethod = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add Sowing Methods.",
      });
    }

    const response = await createRecord(AdminSowingMethod, data);

    if (response?.success) {
      return res.status(201).json({
        message: "New Sowing Method added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add Sowing Method." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Sowing Method.",
    });
  }
};

export const getSowingMethod = async (req, res) => {
  try {
    const response = await getAllRecords(AdminSowingMethod);

    if (response?.success) {
      return res.status(200).json({
        message: "Sowing Methods fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Sowing Methods found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Sowing Methods.",
    });
  }
};

export const getActiveSowingMethod = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminSowingMethod);

    if (response?.success) {
      return res.status(200).json({
        message: "Sowing Methods fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Sowing Methods found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Sowing Methods.",
    });
  }
};

export const updateSowingMethod = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update Sowing Methods.",
      });
    }

    const response = await updateRecord(AdminSowingMethod, id, data);

    if (!response?.success) {
      return res.status(404).json({
        message: response?.error || "Sowing Method not found.",
      });
    }

    return res.status(200).json({
      message: "Sowing Method updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Sowing Method.",
    });
  }
};

export const deleteSowingMethod = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete Sowing Methods.",
      });
    }

    const response = await deleteRecord(AdminSowingMethod, id);

    if (!response?.success) {
      return res.status(404).json({
        message: response?.error || "Sowing Method not found.",
      });
    }

    return res.status(200).json({
      message: "Sowing Method deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Sowing Method.",
    });
  }
};
