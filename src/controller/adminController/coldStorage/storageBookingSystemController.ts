import AdminStorageBookingSystem from "../../../database/models/adminModels/coldStorage/adminStorageBookingSystem";
import StorageBookingSystem from "../../../database/models/storageBookingSystem";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addStorageBookingSystem = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(AdminStorageBookingSystem, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Storage Booking System with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Storage Booking System added successfully.",
        data: response.data,
      });
    }

    return res
      .status(400)
      .json({ message: "Failed to add Storage Booking System." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Storage Booking System.",
    });
  }
};

export const getStorageBookingSystem = async (req, res) => {
  try {
    const response = await getAllRecords(AdminStorageBookingSystem);

    if (response?.success) {
      return res.status(200).json({
        message: "Storage Booking System fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No Storage Booking System found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Storage Booking System.",
    });
  }
};

export const getActiveStorageBookingSystem = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminStorageBookingSystem);

    if (response?.success) {
      return res.status(200).json({
        message: "Storage Booking System fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No active Storage Booking System found." });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Failed to retrieve active Storage Booking System.",
    });
  }
};

export const updateStorageBookingSystem = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(
      AdminStorageBookingSystem,
      id,
      data,
      "name",
      {
        relatedModel: StorageBookingSystem,
        targetField: "bookingSystem",
      }
    );

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Storage Booking System with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Storage Booking System record not found.",
      });
    }

    return res.status(200).json({
      message: "Storage Booking System updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Storage Booking System.",
    });
  }
};

export const deleteStorageBookingSystem = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(AdminStorageBookingSystem, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Storage Booking System record not found.",
      });
    }

    return res.status(200).json({
      message: "Storage Booking System deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Storage Booking System.",
    });
  }
};
