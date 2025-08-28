import AdminOperationalChallenge from "../../../database/models/adminModels/coldStorage/adminOperationalChallenge";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addOperationalChallenge = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(AdminOperationalChallenge, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Operational Challenge with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Operational Challenge added successfully.",
        data: response.data,
      });
    }

    return res
      .status(400)
      .json({ message: "Failed to add operational challenge." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add operational challenge.",
    });
  }
};

export const getOperationalChallenge = async (req, res) => {
  try {
    const response = await getAllRecords(AdminOperationalChallenge);

    if (response?.success) {
      return res.status(200).json({
        message: "Operational Challenges fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No operational challenges found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve operational challenges.",
    });
  }
};

export const getActiveOperationalChallenge = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminOperationalChallenge);

    if (response?.success) {
      return res.status(200).json({
        message: "Operational Challenge fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No operational challenge found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve operational challenges.",
    });
  }
};

export const updateOperationalChallenge = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(AdminOperationalChallenge, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Operational Challenge with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Operational Challenge record not found.",
      });
    }

    return res.status(200).json({
      message: "Operational Challenge updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Operational Challenge.",
    });
  }
};

export const deleteOperationalChallenge = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(AdminOperationalChallenge, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Operational Challenge record not found.",
      });
    }

    return res.status(200).json({
      message: "Operational Challenge deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Operational Challenge.",
    });
  }
};
