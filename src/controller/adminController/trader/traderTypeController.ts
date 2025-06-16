import AdminTraderType from "../../../database/models/adminModels/trader/adminTraderType";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getRecordById,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addTraderType = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins can add trader type." });
  }

  const response = await createRecord(AdminTraderType, req.body);
  if (response.success) {
    return res.status(201).json({
      message: "Trader Type created successfully",
      data: response.data,
    });
  }

  return res.status(400).json({ message: response.error });
};

export const getTraderTypeById = async (req, res) => {
  const response = await getRecordById(AdminTraderType, req.params.id);
  if (response.success)
    return res.status(200).json({
      message: "Trader Type fetched successfully",
      data: response.data,
    });
  return res.status(404).json({ message: response.error });
};

export const getTraderTypes = async (_req, res) => {
  const response = await getAllRecords(AdminTraderType);
  if (response.success)
    return res.status(200).json({
      message: "Trader Type list fetched successfully",
      data: response.data,
    });
  return res.status(400).json({ message: response.error });
};

export const getActiveTraderTypes = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminTraderType);

    if (response.success) {
      return res.status(200).json({
        message: "Trader Type list fetched successfully",
        data: response.data,
      });
    }

    return res.status(400).json({ message: response.error });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTraderType = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins can update trader type." });
  }

  const response = await updateRecord(AdminTraderType, req.params.id, req.body);
  if (response.success) {
    return res.status(200).json({
      message: "Trader Type updated successfully",
      data: response.data,
    });
  }

  return res.status(404).json({ message: response.error });
};

export const deleteTraderType = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins can delete trader type." });
  }

  const response = await deleteRecord(AdminTraderType, req.params.id);
  if (response.success) {
    return res
      .status(200)
      .json({ message: "Trader Type deleted successfully" });
  }

  return res.status(404).json({ message: response.error });
};
