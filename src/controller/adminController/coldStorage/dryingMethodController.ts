import AdminDryingMethod from "../../../database/models/adminModels/coldStorage/adminDryingMethods";
import DryingMethod from "../../../database/models/dryingMethod";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addDryingMethods = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(AdminDryingMethod, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Drying Method with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Drying Method added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add Drying Method." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Drying Method.",
    });
  }
};

export const getDryingMethod = async (req, res) => {
  try {
    const response = await getAllRecords(AdminDryingMethod);

    if (response?.success) {
      return res.status(200).json({
        message: "Drying Methods fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Drying Methods found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Drying Methods.",
    });
  }
};

export const getActiveDryingMethod = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminDryingMethod);

    if (response?.success) {
      return res.status(200).json({
        message: "Active Drying Methods fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No active Drying Methods found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve active Drying Methods.",
    });
  }
};

export const updateDryingMethod = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(AdminDryingMethod, id, data, "name", {
      relatedModel: DryingMethod,
      targetField: "method",
    });

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Drying Method with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Drying Method record not found.",
      });
    }

    return res.status(200).json({
      message: "Drying Method updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Drying Method.",
    });
  }
};

export const deleteDryingMethod = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(AdminDryingMethod, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Drying Method not found.",
      });
    }

    return res.status(200).json({
      message: "Drying Method deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Drying Method.",
    });
  }
};
