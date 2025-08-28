import AdminPowerFacility from "../../../database/models/adminModels/coldStorage/adminPowerFacility";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addPowerFacility = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(AdminPowerFacility, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Power Facility with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Power Facility added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add Power Facility." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Power Facility.",
    });
  }
};

export const getPowerFacility = async (req, res) => {
  try {
    const response = await getAllRecords(AdminPowerFacility);

    if (response?.success) {
      return res.status(200).json({
        message: "Power Facility fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Power Facility found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Power Facility.",
    });
  }
};

export const getActivePowerFacility = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminPowerFacility);

    if (response?.success) {
      return res.status(200).json({
        message: "Power Facility fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No active Power Facility found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve active Power Facility.",
    });
  }
};

export const updatePowerFacility = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(AdminPowerFacility, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Power Facility with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Power Facility record not found.",
      });
    }

    return res.status(200).json({
      message: "Power Facility updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Power Facility.",
    });
  }
};

export const deletePowerFacility = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(AdminPowerFacility, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Power Facility record not found.",
      });
    }

    return res.status(200).json({
      message: "Power Facility deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Power Facility.",
    });
  }
};
