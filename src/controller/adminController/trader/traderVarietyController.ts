import AdminTraderVariety from "../../../database/models/adminModels/trader/adminTraderVariety";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getRecordById,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addTraderVariety = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins can add trader variety." });
  }

  const response = await createRecord(AdminTraderVariety, req.body);
  if (response.success) {
    return res.status(201).json({
      message: "Trader Variety created successfully",
      data: response.data,
    });
  }

  return res.status(400).json({ message: response.error });
};

export const getTraderVarietyById = async (req, res) => {
  const response = await getRecordById(AdminTraderVariety, req.params.id);
  if (response.success)
    return res.status(200).json({
      message: "Trader Variety fetched successfully",
      data: response.data,
    });
  return res.status(404).json({ message: response.error });
};

export const getTraderVarieties = async (_req, res) => {
  const response = await getAllRecords(AdminTraderVariety);
  if (response.success)
    return res.status(200).json({
      message: "Trader Variety list fetched successfully",
      data: response.data,
    });
  return res.status(400).json({ message: response.error });
};

export const getActiveTraderVarieties = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminTraderVariety);

    if (response.success) {
      return res.status(200).json({
        message: "Trader Variety list fetched successfully",
        data: response.data,
      });
    }

    return res.status(400).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTraderVariety = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins can update trader variety." });
  }

  const response = await updateRecord(
    AdminTraderVariety,
    req.params.id,
    req.body
  );
  if (response.success) {
    return res.status(200).json({
      message: "Trader Variety updated successfully",
      data: response.data,
    });
  }

  return res.status(404).json({ message: response.error });
};

export const deleteTraderVariety = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins can delete trader variety." });
  }

  const response = await deleteRecord(AdminTraderVariety, req.params.id);
  if (response.success) {
    return res
      .status(200)
      .json({ message: "Trader Variety deleted successfully" });
  }

  return res.status(404).json({ message: response.error });
};
