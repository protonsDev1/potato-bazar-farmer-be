import AdminPotatoDisposalSystem from "../../../database/models/adminModels/coldStorage/adminPotatoDisposableSystem";
import PotatoDisposalSystem from "../../../database/models/potatoDisposalSystem";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addPotatoDisposalSystem = async (req, res) => {
  try {
    const data = req.body;

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
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(
      AdminPotatoDisposalSystem,
      id,
      data,
      "name",
      {
        relatedModel: PotatoDisposalSystem,
        targetField: "disposalSystem",
      }
    );

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
    const id = req.params.id;

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
