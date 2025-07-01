import AdminBrandPreferenceReason from "../../../database/models/adminModels/farmer/adminBrandPreferenceReason";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addBrandPreferenceReason = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add brand preference reason.",
      });
    }

    const response = await createRecord(AdminBrandPreferenceReason, data);

    if (response?.success) {
      return res.status(201).json({
        message: "Brand preference reason added successfully.",
        data: response.data,
      });
    }

    return res
      .status(400)
      .json({ message: "Failed to add brand preference reason." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add brand preference reason.",
    });
  }
};

export const getBrandPreferenceReasons = async (req, res) => {
  try {
    const response = await getAllRecords(AdminBrandPreferenceReason);

    if (response?.success) {
      return res.status(200).json({
        message: "Brand preference reasons fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No brand preference reasons found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve brand preference reasons.",
    });
  }
};

export const getActiveBrandPreferenceReasons = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminBrandPreferenceReason);

    if (response?.success) {
      return res.status(200).json({
        message: "Active brand preference reasons fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No active brand preference reasons found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve brand preference reasons.",
    });
  }
};

export const updateBrandPreferenceReason = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message:
          "Only Admins are authorized to update brand preference reason.",
      });
    }

    const response = await updateRecord(AdminBrandPreferenceReason, id, data);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Brand preference reason not found.",
      });
    }

    return res.status(200).json({
      message: "Brand preference reason updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update brand preference reason.",
    });
  }
};

export const deleteBrandPreferenceReason = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message:
          "Only Admins are authorized to delete brand preference reason.",
      });
    }

    const response = await deleteRecord(AdminBrandPreferenceReason, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Brand preference reason not found.",
      });
    }

    return res.status(200).json({
      message: "Brand preference reason deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete brand preference reason.",
    });
  }
};
