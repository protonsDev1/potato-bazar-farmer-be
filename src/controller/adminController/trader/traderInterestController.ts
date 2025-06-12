import AdminTraderInterest from "../../../database/models/adminModels/trader/adminTraderInterest";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getRecordById,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addTraderInterest = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can add trader interest." });
    }

    const response = await createRecord(AdminTraderInterest, req.body);
    if (response.success) {
      return res.status(201).json({
        message: "Trader Interest created successfully",
        data: response.data,
      });
    }

    return res.status(400).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTraderInterestById = async (req, res) => {
  try {
    const response = await getRecordById(AdminTraderInterest, req.params.id);
    if (response.success)
      return res.status(200).json({
        message: "Trader Interest fetched successfully",
        data: response.data,
      });

    return res.status(404).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTraderInterests = async (req, res) => {
  try {
    const response = await getAllRecords(AdminTraderInterest);
    if (response.success)
      return res.status(200).json({
        message: "Trader Interest list fetched successfully",
        data: response.data,
      });

    return res.status(400).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getActiveTraderInterests = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminTraderInterest);

    if (response.success) {
      return res.status(200).json({
        message: "Trader Interest list fetched successfully",
        data: response.data,
      });
    }

    return res.status(400).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTraderInterest = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can update trader interest." });
    }

    const response = await updateRecord(
      AdminTraderInterest,
      req.params.id,
      req.body
    );
    if (response.success) {
      return res.status(200).json({
        message: "Trader Interest updated successfully",
        data: response.data,
      });
    }

    return res.status(404).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTraderInterest = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can delete trader interest." });
    }

    const response = await deleteRecord(AdminTraderInterest, req.params.id);
    if (response.success) {
      return res
        .status(200)
        .json({ message: "Trader Interest deleted successfully" });
    }

    return res.status(404).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
