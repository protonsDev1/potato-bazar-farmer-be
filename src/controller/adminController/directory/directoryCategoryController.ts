import DirectoryCategory from "../../../database/models/directoryCategory";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addDirectoryCategory = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(DirectoryCategory, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Directory Category with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Directory Category added successfully.",
        data: response.data,
      });
    }

    return res
      .status(400)
      .json({ message: "Failed to add Directory Category." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Directory Category.",
    });
  }
};

export const getDirectoryCategory = async (req, res) => {
  try {
    const response = await getAllRecords(DirectoryCategory);

    if (response?.success) {
      return res.status(200).json({
        message: "Directory Categories fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Directory Category found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Directory Category.",
    });
  }
};

export const getActiveDirectoryCategory = async (req, res) => {
  try {
    const response = await getActiveRecords(DirectoryCategory);

    if (response?.success) {
      return res.status(200).json({
        message: "Potato Categories fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Directory Category found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Directory Category.",
    });
  }
};

export const updateDirectoryCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(DirectoryCategory, id, data, "name", {
      relatedModel: DirectoryCategory,
      targetField: "name",
    });

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Directory Category with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Directory Category not found.",
      });
    }

    return res.status(200).json({
      message: "Directory Category updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Directory Category.",
    });
  }
};

export const deleteDirectoryCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(DirectoryCategory, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Directory Category not found.",
      });
    }

    return res.status(200).json({
      message: "Directory Category deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Directory Category.",
    });
  }
};
