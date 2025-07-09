import AdminDryingFacilityDetail from "../../../database/models/adminModels/coldStorage/adminDryingFacilityDetails";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addDryingFacilityDetail = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add Drying Facility Detail.",
      });
    }

    const response = await createRecord(AdminDryingFacilityDetail, data);

    if (response?.success) {
      return res.status(201).json({
        message: "New Drying Facility Detail added successfully.",
        data: response.data,
      });
    }

    return res
      .status(400)
      .json({ message: "Failed to add Drying Facility Detail." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Drying Facility Detail.",
    });
  }
};

export const getDryingFacilityDetail = async (req, res) => {
  try {
    const response = await getAllRecords(AdminDryingFacilityDetail);

    if (response?.success) {
      return res.status(200).json({
        message: "Drying Facility Detail fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No Drying Facility Detail found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Drying Facility Detail.",
    });
  }
};

export const getActiveDryingFacilityDetail = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminDryingFacilityDetail);

    if (response?.success) {
      return res.status(200).json({
        message: "Active Drying Facility Detail fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No active Drying Facility Detail found." });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Failed to retrieve active Drying Facility Detail.",
    });
  }
};

export const updateDryingFacilityDetail = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update Drying Facility Detail.",
      });
    }

    const response = await updateRecord(AdminDryingFacilityDetail, id, data);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Drying Facility Detail record not found.",
      });
    }

    return res.status(200).json({
      message: "Drying Facility Detail updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Drying Facility Detail.",
    });
  }
};

export const deleteDryingFacilityDetail = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete Drying Facility Detail.",
      });
    }

    const response = await deleteRecord(AdminDryingFacilityDetail, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Drying Facility Detail record not found.",
      });
    }

    return res.status(200).json({
      message: "Drying Facility Detail deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Drying Facility Detail.",
    });
  }
};
