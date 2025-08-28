import AdminElevatorType from "../../../database/models/adminModels/coldStorage/adminElevatorType";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addElevatorType = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(AdminElevatorType, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Elevator Type with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Elevator Type added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add Elevator Type." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Elevator Type.",
    });
  }
};

export const getElevatorType = async (req, res) => {
  try {
    const response = await getAllRecords(AdminElevatorType);

    if (response?.success) {
      return res.status(200).json({
        message: "Elevator Type fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Elevator Type found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Elevator Type.",
    });
  }
};

export const getActiveElevatorType = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminElevatorType);

    if (response?.success) {
      return res.status(200).json({
        message: "Active Elevator Type fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No active Elevator Type  found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve active Elevator Type.",
    });
  }
};

export const updateElevatorType = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(AdminElevatorType, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Elevator Type with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Elevator Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Elevator Type updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Elevator Type.",
    });
  }
};

export const deleteElevatorType = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(AdminElevatorType, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Elevator Type record not found.",
      });
    }

    return res.status(200).json({
      message: "Elevator Type deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Elevator Type.",
    });
  }
};
