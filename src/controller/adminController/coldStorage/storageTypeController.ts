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
    const data = req.body;

    const response = await createRecord(AdminStorageType, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Storage Type with this name already exists.",
      });
    }

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
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(AdminStorageType, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Storage Type with this name already exists.",
      });
    }

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
    const id = req.params.id;

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
