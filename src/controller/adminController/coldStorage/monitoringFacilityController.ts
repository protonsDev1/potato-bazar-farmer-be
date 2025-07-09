import AdminMonitoringFacility from "../../../database/models/adminModels/coldStorage/adminMonitoringFacilities";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addMonitoringFacility = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add Monitoring Facility.",
      });
    }

    const response = await createRecord(AdminMonitoringFacility, data);

    if (response?.success) {
      return res.status(201).json({
        message: "New Monitoring Facility added successfully.",
        data: response.data,
      });
    }

    return res
      .status(400)
      .json({ message: "Failed to add Monitoring Facility." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Monitoring Facility.",
    });
  }
};

export const getMonitoringFacility = async (req, res) => {
  try {
    const response = await getAllRecords(AdminMonitoringFacility);

    if (response?.success) {
      return res.status(200).json({
        message: "Monitoring Facility fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Monitoring Facility found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Monitoring Facility.",
    });
  }
};

export const getActiveMonitoringFacility = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminMonitoringFacility);

    if (response?.success) {
      return res.status(200).json({
        message: "Monitoring Facility fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No active Monitoring Facility found." });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Failed to retrieve active Monitoring Facility.",
    });
  }
};

export const updateMonitoringFacility = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update Monitoring Facility.",
      });
    }

    const response = await updateRecord(AdminMonitoringFacility, id, data);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Monitoring Facility record not found.",
      });
    }

    return res.status(200).json({
      message: "Monitoring Facility updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Monitoring Facility.",
    });
  }
};

export const deleteMonitoringFacility = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete Monitoring Facility.",
      });
    }

    const response = await deleteRecord(AdminMonitoringFacility, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Monitoring Facility record not found.",
      });
    }

    return res.status(200).json({
      message: "Monitoring Facility deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Monitoring Facility.",
    });
  }
};
