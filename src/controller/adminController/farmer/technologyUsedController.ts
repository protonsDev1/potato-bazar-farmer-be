import AdminTechnologyUsed from "../../../database/models/adminModels/farmer/adminTechnologyUsed";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addTechnologyUsed = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add Technology.",
      });
    }

    const response = await createRecord(AdminTechnologyUsed, data);

    if (response?.success) {
      return res.status(201).json({
        message: "New Technology added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add Technology." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Technology.",
    });
  }
};

export const getTechnologyUsed = async (req, res) => {
  try {
    const response = await getAllRecords(AdminTechnologyUsed);

    if (response?.success) {
      return res.status(200).json({
        message: "Technologies fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Technology found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Technology.",
    });
  }
};

export const getActiveTechnologyUsed = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminTechnologyUsed);

    if (response?.success) {
      return res.status(200).json({
        message: "Technologies fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Technology found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Technology.",
    });
  }
};

export const updateTechnologyUsed = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update Technology.",
      });
    }

    const response = await updateRecord(AdminTechnologyUsed, id, data);

    if (!response?.success) {
      return res.status(404).json({
        message: response?.error || "Technology not found.",
      });
    }

    return res.status(200).json({
      message: "Technology updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Technology.",
    });
  }
};

export const deleteTechnologyUsed = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete Technology.",
      });
    }

    const response = await deleteRecord(AdminTechnologyUsed, id);

    if (!response?.success) {
      return res.status(404).json({
        message: response?.error || "Technology not found.",
      });
    }

    return res.status(200).json({
      message: "Technology deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Technology.",
    });
  }
};
