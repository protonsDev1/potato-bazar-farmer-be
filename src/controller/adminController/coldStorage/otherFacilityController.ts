import AdminOtherFacility from "../../../database/models/adminModels/coldStorage/adminOtherFacility";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addOtherFacility = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add Other Facility.",
      });
    }

    const response = await createRecord(AdminOtherFacility, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Other Facility with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Other Facility added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add Other Facility." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Other Facility.",
    });
  }
};

export const getOtherFacility = async (req, res) => {
  try {
    const response = await getAllRecords(AdminOtherFacility);

    if (response?.success) {
      return res.status(200).json({
        message: "Other Facility fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Other Facility found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Other Facility.",
    });
  }
};

export const getActiveOtherFacility = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminOtherFacility);

    if (response?.success) {
      return res.status(200).json({
        message: "Other Facility fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No active Other Facility found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve active Other Facility.",
    });
  }
};

export const updateOtherFacility = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update Other Facility.",
      });
    }

    const response = await updateRecord(AdminOtherFacility, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Other Facility with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Other Facility record not found.",
      });
    }

    return res.status(200).json({
      message: "Other Facility updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Other Facility.",
    });
  }
};

export const deleteOtherFacility = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete Other Facility.",
      });
    }

    const response = await deleteRecord(AdminOtherFacility, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Other Facility record not found.",
      });
    }

    return res.status(200).json({
      message: "Other Facility deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Other Facility.",
    });
  }
};
