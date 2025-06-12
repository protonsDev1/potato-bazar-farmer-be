import AdminPotatoSubVarietyGrown from "../../../database/models/adminModels/farmer/adminPotatoSubVariety";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addPotatoSubVarietyGrown = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add Potato Sub Variety.",
      });
    }

    const response = await createRecord(AdminPotatoSubVarietyGrown, data);

    if (response?.success) {
      return res.status(201).json({
        message: "New Potato Sub Variety added successfully.",
        data: response.data,
      });
    }

    return res
      .status(400)
      .json({ message: "Failed to add Potato Sub Variety." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Potato Sub Variety.",
    });
  }
};

export const getPotatoSubVarietyGrown = async (req, res) => {
  try {
    const response = await getAllRecords(AdminPotatoSubVarietyGrown);

    if (response?.success) {
      return res.status(200).json({
        message: "Potato Sub Varieties fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Potato Sub Variety found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Potato Sub Variety.",
    });
  }
};

export const getActivePotatoSubVarietyGrown = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminPotatoSubVarietyGrown);

    if (response?.success) {
      return res.status(200).json({
        message: "Potato Sub Varieties fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Potato Sub Variety found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Potato Sub Variety.",
    });
  }
};

export const updatePotatoSubVariety = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update Potato Sub Variety.",
      });
    }

    const response = await updateRecord(AdminPotatoSubVarietyGrown, id, data);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Potato Sub Variety not found.",
      });
    }

    return res.status(200).json({
      message: "Potato Sub Variety updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Potato Sub Variety.",
    });
  }
};

export const deletePotatoSubVariety = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete Potato Sub Variety.",
      });
    }

    const response = await deleteRecord(AdminPotatoSubVarietyGrown, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Potato Sub Variety not found.",
      });
    }

    return res.status(200).json({
      message: "Potato Sub Variety deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Potato Sub Variety.",
    });
  }
};
