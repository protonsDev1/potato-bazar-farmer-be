import AdminBiggestChallengeInSelling from "../../../database/models/adminModels/farmer/adminBiggestChallengeInSelling";
import {
  createRecord,
  deleteRecord,
  getActiveRecords,
  getAllRecords,
  updateRecord,
} from "../../../services/adminServices/crudOperationService";

export const addBiggestChallengeInSelling = async (req, res) => {
  try {
    const { role } = req.user;
    const biggestChallenge = req.body;

    if (role !== "admin")
      return res.status(403).json({
        message:
          "Only Admins are authorized to add Biggest Challenge in Selling.",
      });

    const response = await createRecord(
      AdminBiggestChallengeInSelling,
      biggestChallenge
    );

    if (response?.success)
      return res.status(201).json({
        message: "New Biggest Challenge in Selling added successfully.",
        data: response.data,
      });

    return res.status(400).json({ message: "Failed to add record." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Biggest Challenge in Selling.",
    });
  }
};

export const getBiggestChallengeInSelling = async (req, res) => {
  try {
    const response = await getAllRecords(AdminBiggestChallengeInSelling);

    if (response?.success)
      return res.status(200).json({
        message: "Biggest Challenges in Selling fetched successfully.",
        data: response.data,
      });

    return res.status(404).json({ message: "No records found." });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Failed to retrieve Biggest Challenge in Selling.",
    });
  }
};

export const getActiveBiggestChallengeInSelling = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminBiggestChallengeInSelling);

    if (response?.success)
      return res.status(200).json({
        message: "Active Biggest Challenges in Selling fetched successfully.",
        data: response.data,
      });

    return res.status(404).json({ message: "No active records found." });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message ||
        "Failed to retrieve Active Biggest Challenge in Selling.",
    });
  }
};

export const updateBiggestChallengeInSelling = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin")
      return res.status(403).json({
        message:
          "Only Admins are authorized to update Biggest Challenge in Selling.",
      });

    const response = await updateRecord(
      AdminBiggestChallengeInSelling,
      id,
      data
    );

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Record not found.",
      });
    }

    return res.status(200).json({
      message: "Biggest Challenge in Selling updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Failed to update Biggest Challenge in Selling.",
    });
  }
};

export const deleteBiggestChallengeInSelling = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin")
      return res.status(403).json({
        message:
          "Only Admins are authorized to delete Biggest Challenge in Selling.",
      });

    const response = await deleteRecord(AdminBiggestChallengeInSelling, id);

    if (!response || response.success === false)
      return res.status(404).json({
        message: response?.error || "Record not found.",
      });

    return res.status(200).json({
      message: "Biggest Challenge in Selling deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Failed to delete Biggest Challenge in Selling.",
    });
  }
};
