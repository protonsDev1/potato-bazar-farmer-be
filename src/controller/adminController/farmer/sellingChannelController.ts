import AdminSellingChannel from "../../../database/models/adminModels/farmer/adminSellingChannel";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addSellingChannel = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add selling channel.",
      });
    }

    const response = await createRecord(AdminSellingChannel, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Selling channel with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "Selling channel added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add selling channel." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add selling channel.",
    });
  }
};

export const getSellingChannels = async (req, res) => {
  try {
    const response = await getAllRecords(AdminSellingChannel);

    if (response?.success) {
      return res.status(200).json({
        message: "Selling channels fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No selling channels found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve selling channels.",
    });
  }
};

export const getActiveSellingChannels = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminSellingChannel);

    if (response?.success) {
      return res.status(200).json({
        message: "Active selling channels fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No active selling channels found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve active selling channels.",
    });
  }
};

export const updateSellingChannel = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update selling channel.",
      });
    }

    const response = await updateRecord(AdminSellingChannel, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Selling channel with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Selling channel not found.",
      });
    }

    return res.status(200).json({
      message: "Selling channel updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update selling channel.",
    });
  }
};

export const deleteSellingChannel = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete selling channel.",
      });
    }

    const response = await deleteRecord(AdminSellingChannel, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Selling channel not found.",
      });
    }

    return res.status(200).json({
      message: "Selling channel deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete selling channel.",
    });
  }
};
