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
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add operational challenges.",
      });
    }

    const response = await createRecord(AdminOperationalChallenge, data);

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
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update operational challenges.",
      });
    }

    const response = await updateRecord(AdminOperationalChallenge, id, data);

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
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete operational challenges.",
      });
    }

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
