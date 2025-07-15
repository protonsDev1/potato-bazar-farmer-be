import AdminPotatoDisposalSystem from "../../../database/models/adminModels/coldStorage/adminPotatoDisposableSystem";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addPotatoDisposalSystem = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add Potato Disposal System.",
      });
    }

    const response = await createRecord(AdminPotatoDisposalSystem, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Other Facility with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Potato Disposal System added successfully.",
        data: response.data,
      });
    }

    return res
      .status(400)
      .json({ message: "Failed to add Potato Disposal System." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Potato Disposal System.",
    });
  }
};

export const getPotatoDisposalSystem = async (req, res) => {
  try {
    const response = await getAllRecords(AdminPotatoDisposalSystem);

    if (response?.success) {
      return res.status(200).json({
        message: "Potato Disposal System fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No Potato Disposal System found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Potato Disposal System.",
    });
  }
};

export const getActivePotatoDisposalSystem = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminPotatoDisposalSystem);

    if (response?.success) {
      return res.status(200).json({
        message: "Potato Disposal System fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No active Potato Disposal System found." });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Failed to retrieve active Potato Disposal System.",
    });
  }
};

export const updatePotatoDisposalSystem = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update Potato Disposal System.",
      });
    }

    const response = await updateRecord(AdminPotatoDisposalSystem, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Potato Disposal System with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Potato Disposal System record not found.",
      });
    }

    return res.status(200).json({
      message: "Potato Disposal System updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Potato Disposal System.",
    });
  }
};

export const deletePotatoDisposalSystem = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete Potato Disposal System.",
      });
    }

    const response = await deleteRecord(AdminPotatoDisposalSystem, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Potato Disposal System record not found.",
      });
    }

    return res.status(200).json({
      message: "Potato Disposal System deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Potato Disposal System.",
    });
  }
};
