import AdminSellingPrice from "../../../database/models/adminModels/farmer/adminSellingPrice";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addSellingPrice = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add selling price.",
      });
    }

    const response = await createRecord(AdminSellingPrice, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Selling price with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Selling Price added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add selling price." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add selling price.",
    });
  }
};

export const getSellingPrice = async (req, res) => {
  try {
    const response = await getAllRecords(AdminSellingPrice);

    if (response?.success) {
      return res.status(200).json({
        message: "Selling prices fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No selling prices found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve selling prices.",
    });
  }
};

export const getActiveSellingPrice = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminSellingPrice);

    if (response?.success) {
      return res.status(200).json({
        message: "Selling prices fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No selling prices found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve selling prices.",
    });
  }
};

export const updateSellingPrice = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update selling prices.",
      });
    }

    const response = await updateRecord(AdminSellingPrice, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Selling price with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Selling price record not found.",
      });
    }

    return res.status(200).json({
      message: "Selling price updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update selling price.",
    });
  }
};

export const deleteSellingPrice = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete selling prices.",
      });
    }

    const response = await deleteRecord(AdminSellingPrice, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Selling price record not found.",
      });
    }

    return res.status(200).json({
      message: "Selling price deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete selling price.",
    });
  }
};
