import AdminConstructionType from "../../../database/models/adminModels/coldStorage/adminConstructionType";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addConstructionType = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add Construction Type.",
      });
    }

    const response = await createRecord(AdminConstructionType, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Construction Type with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Construction Type added successfully.",
        data: response.data,
      });
    }

    return res
      .status(400)
      .json({ message: "Failed to add Construction Type." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Construction Type.",
    });
  }
};

export const getConstructionType = async (req, res) => {
  try {
    const response = await getAllRecords(AdminConstructionType);

    if (response?.success) {
      return res.status(200).json({
        message: "Construction Type fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Construction Type found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Construction Type.",
    });
  }
};

export const getActiveConstructionType = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminConstructionType);

    if (response?.success) {
      return res.status(200).json({
        message: "Active Construction Type fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No active Construction Type found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve active Construction Type.",
    });
  }
};

export const updateConstructionType = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update Construction Type.",
      });
    }

    const response = await updateRecord(AdminConstructionType, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Construction Type with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Construction Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Construction Type updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Construction Type.",
    });
  }
};

export const deleteConstructionType = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete Construction Type.",
      });
    }

    const response = await deleteRecord(AdminConstructionType, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Construction Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Construction Type deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Construction Type.",
    });
  }
};
