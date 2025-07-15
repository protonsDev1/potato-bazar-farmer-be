import AdminPotatoType from "../../../database/models/adminModels/farmer/adminPotatoType";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addPotatoType = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add potato types.",
      });
    }

    const response = await createRecord(AdminPotatoType, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Potato Type with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Potato Type added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add potato type." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add potato type.",
    });
  }
};

export const getPotatoType = async (req, res) => {
  try {
    const response = await getAllRecords(AdminPotatoType);

    if (response?.success) {
      return res.status(200).json({
        message: "Potato types fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No potato types found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve potato types.",
    });
  }
};

export const getActivePotatoType = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminPotatoType);

    if (response?.success) {
      return res.status(200).json({
        message: "Potato types fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No potato types found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve potato types.",
    });
  }
};

export const updatePotatoType = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update potato types.",
      });
    }

    const response = await updateRecord(AdminPotatoType, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Potato Type with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Potato Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Potato Type updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update potato type.",
    });
  }
};

export const deletePotatoType = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete potato types.",
      });
    }

    const response = await deleteRecord(AdminPotatoType, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Potato Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Potato Type deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete potato type.",
    });
  }
};
