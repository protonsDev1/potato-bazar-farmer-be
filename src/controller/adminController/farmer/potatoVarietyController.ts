import AdminPotatoVarietyGrown from "../../../database/models/adminModels/farmer/adminPotatoVarietyGrown";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addPotatoVarietyGrown = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add Potato Variety.",
      });
    }

    const response = await createRecord(AdminPotatoVarietyGrown, data);

    if (response?.success) {
      return res.status(201).json({
        message: "New Potato Variety added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add Potato Variety." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Potato Variety.",
    });
  }
};

export const getPotatoVarietyGrown = async (req, res) => {
  try {
    const response = await getAllRecords(AdminPotatoVarietyGrown);

    if (response?.success) {
      return res.status(200).json({
        message: "Potato Varieties fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Potato Variety found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Potato Variety.",
    });
  }
};

export const getActivePotatoVarietyGrown = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminPotatoVarietyGrown);

    if (response?.success) {
      return res.status(200).json({
        message: "Potato Varieties fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Potato Variety found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Potato Variety.",
    });
  }
};

export const updatePotatoVariety = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update Potato Variety.",
      });
    }

    const response = await updateRecord(AdminPotatoVarietyGrown, id, data);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Potato Variety not found.",
      });
    }

    return res.status(200).json({
      message: "Potato Variety updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Potato Variety.",
    });
  }
};

export const deletePotatoVariety = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete Potato Variety.",
      });
    }

    const response = await deleteRecord(AdminPotatoVarietyGrown, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Potato Variety not found.",
      });
    }

    return res.status(200).json({
      message: "Potato Variety deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Potato Variety.",
    });
  }
};
