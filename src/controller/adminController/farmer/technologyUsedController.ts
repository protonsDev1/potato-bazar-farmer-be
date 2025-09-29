import AdminTechnologyUsed from "../../../database/models/adminModels/farmer/adminTechnologyUsed";
import TechnologyUsed from "../../../database/models/technologyUsed";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addTechnologyUsed = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(AdminTechnologyUsed, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Technology with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Technology added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add Technology." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Technology.",
    });
  }
};

export const getTechnologyUsed = async (req, res) => {
  try {
    const response = await getAllRecords(AdminTechnologyUsed);

    if (response?.success) {
      return res.status(200).json({
        message: "Technologies fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Technology found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Technology.",
    });
  }
};

export const getActiveTechnologyUsed = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminTechnologyUsed);

    if (response?.success) {
      return res.status(200).json({
        message: "Technologies fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Technology found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Technology.",
    });
  }
};

export const updateTechnologyUsed = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(AdminTechnologyUsed, id, data, "name", {
      relatedModel: TechnologyUsed,
      targetField: "name",
    });

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Technology with this name already exists.",
      });
    }

    if (!response?.success) {
      return res.status(404).json({
        message: response?.error || "Technology not found.",
      });
    }

    return res.status(200).json({
      message: "Technology updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Technology.",
    });
  }
};

export const deleteTechnologyUsed = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(AdminTechnologyUsed, id);

    if (!response?.success) {
      return res.status(404).json({
        message: response?.error || "Technology not found.",
      });
    }

    return res.status(200).json({
      message: "Technology deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Technology.",
    });
  }
};
