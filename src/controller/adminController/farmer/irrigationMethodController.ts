import AdminIrrigationMethod from "../../../database/models/adminModels/farmer/adminIrrigationMethod";
import {
  createRecord,
  deleteRecord,
  getActiveRecords,
  getAllRecords,
  updateRecord,
} from "../../../services/adminServices/crudOperationService";

export const addIrrigationMethod = async (req, res) => {
  try {
    const { role } = req.user;

    const irrigationMethod = req.body;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to add irrigation methods.",
      });

    const response = await createRecord(
      AdminIrrigationMethod,
      irrigationMethod
    );

    if (!response.success) {
      return res.status(400).json({
        message: response.error || "Failed to add irrigation method.",
      });
    }

    return res.status(201).json({
      message: "New Irrigation Method added successfully.",
      data: response.data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to add irrigation method." });
  }
};

export const getIrrigationMethod = async (req, res) => {
  try {
    const response = await getAllRecords(AdminIrrigationMethod);

    if (!response.success) {
      return res.status(400).json({
        message: response.error || "Failed to fetch irrigation methods.",
      });
    }

    return res
      .status(200)
      .json({ message: "Fetched successfully.", data: response.data });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve irrigation methods.",
    });
  }
};

export const getActiveIrrigationMethod = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminIrrigationMethod);

    if (!response.success) {
      return res.status(400).json({
        message: response.error || "Failed to fetch irrigation methods.",
      });
    }

    return res
      .status(200)
      .json({ message: "Fetched successfully.", data: response.data });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve irrigation methods.",
    });
  }
};

export const updateIrrigationMethod = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to update irrigation methods.",
      });

    const response = await updateRecord(AdminIrrigationMethod, id, data);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Irrigation Method not found.",
      });
    }

    return res.status(200).json({
      message: "Irrigation Method updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update irrigation methods.",
    });
  }
};

export const deleteIrrigationMethod = async (req, res) => {
  try {
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to delete irrigation methods.",
      });

    const response = await deleteRecord(AdminIrrigationMethod, id);

    if (!response.success) {
      return res
        .status(404)
        .json({ message: response.error || "Irrigation Method not found." });
    }

    return res
      .status(200)
      .json({ message: "Irrigation Method deleted successfully." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete irrigation methods.",
    });
  }
};
