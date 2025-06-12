import AdminPriceDiscovery from "../../../database/models/adminModels/farmer/adminPriceDiscovery";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addPriceDiscovery = async (req, res) => {
  try {
    const { role } = req.user;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to add Price Discovery.",
      });
    }

    const response = await createRecord(AdminPriceDiscovery, data);

    if (response?.success) {
      return res.status(201).json({
        message: "New Price Discovery added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add Price Discovery." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Price Discovery.",
    });
  }
};

export const getPriceDiscovery = async (req, res) => {
  try {
    const response = await getAllRecords(AdminPriceDiscovery);

    if (response?.success) {
      return res.status(200).json({
        message: "Price Discovery records fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No Price Discovery records found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Price Discovery.",
    });
  }
};

export const getActivePriceDiscovery = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminPriceDiscovery);

    if (response?.success) {
      return res.status(200).json({
        message: "Price Discovery records fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No Price Discovery records found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Price Discovery.",
    });
  }
};

export const updatePriceDiscovery = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;
    const data = req.body;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to update Price Discovery.",
      });
    }

    const response = await updateRecord(AdminPriceDiscovery, id, data);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Price Discovery record not found.",
      });
    }

    return res.status(200).json({
      message: "Price Discovery updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Price Discovery.",
    });
  }
};

export const deletePriceDiscovery = async (req, res) => {
  try {
    const { role } = req.user;
    const id = req.params.id;

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only Admins are authorized to delete Price Discovery.",
      });
    }

    const response = await deleteRecord(AdminPriceDiscovery, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Price Discovery record not found.",
      });
    }

    return res.status(200).json({
      message: "Price Discovery deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Price Discovery.",
    });
  }
};
