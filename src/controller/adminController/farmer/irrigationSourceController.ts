import AdminIrrigationSource from "../../../database/models/adminModels/farmer/adminIrrigationSource";
import {
  createRecord,
  deleteRecord,
  getActiveRecords,
  getAllRecords,
  updateRecord,
} from "../../../services/adminServices/crudOperationService";

export const addIrrigationSource = async (req, res) => {
  try {
    const { role } = req.user;

    const irrigationSource = req.body;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to add irrigation sources.",
      });

    const response = await createRecord(
      AdminIrrigationSource,
      irrigationSource
    );

    if (!response.success) {
      return res.status(400).json({
        message: response.error || "Failed to add irrigation source.",
      });
    }

    return res.status(201).json({
      message: "New Irrigation Source added successfully.",
      data: response.data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to add irrigation source." });
  }
};

export const getIrrigationSource = async (req, res) => {
  try {
    const response = await getAllRecords(AdminIrrigationSource);

    if (!response.success) {
      return res.status(400).json({
        message: response.error || "Failed to fetch irrigation sources.",
      });
    }

    return res
      .status(200)
      .json({ message: "Fetched successfully.", data: response.data });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve irrigation sources.",
    });
  }
};

export const getActiveIrrigationSource = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminIrrigationSource);

    if (!response.success) {
      return res.status(400).json({
        message: response.error || "Failed to fetch irrigation sources.",
      });
    }

    return res
      .status(200)
      .json({ message: "Fetched successfully.", data: response.data });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve irrigation sources.",
    });
  }
};

export const updateIrrigationSource = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to update irrigation sources.",
      });

    const response = await updateRecord(AdminIrrigationSource, id, data);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Irrigation Source not found.",
      });
    }

    return res.status(200).json({
      message: "Irrigation Source updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update irrigation sources.",
    });
  }
};

export const deleteIrrigationSource = async (req, res) => {
  try {
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to delete irrigation sources.",
      });

    const response = await deleteRecord(AdminIrrigationSource, id);

    if (!response.success) {
      return res
        .status(404)
        .json({ message: response.error || "Irrigation Source not found." });
    }

    return res
      .status(200)
      .json({ message: "Irrigation Source deleted successfully." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete irrigation sources.",
    });
  }
};
