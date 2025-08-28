import AdminSeedBrand from "../../../database/models/adminModels/farmer/adminSeedBrand";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

export const addSeedBrand = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(AdminSeedBrand, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Seed brand with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "Seed brand added successfully.",
        data: response.data,
      });
    }

    return res.status(400).json({ message: "Failed to add seed brand." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to add seed brand." });
  }
};

export const getSeedBrands = async (req, res) => {
  try {
    const response = await getAllRecords(AdminSeedBrand);
    if (response?.success) {
      return res.status(200).json({
        message: "Seed brands fetched successfully.",
        data: response.data,
      });
    }
    return res.status(404).json({ message: "No seed brands found." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to retrieve seed brands." });
  }
};

export const getActiveSeedBrands = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminSeedBrand);
    if (response?.success) {
      return res.status(200).json({
        message: "Active seed brands fetched successfully.",
        data: response.data,
      });
    }
    return res.status(404).json({ message: "No active seed brands found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve active seed brands.",
    });
  }
};

export const updateSeedBrand = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(AdminSeedBrand, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Seed brand with this name already exists.",
      });
    }

    if (!response?.success) {
      return res
        .status(404)
        .json({ message: response?.error || "Seed brand not found." });
    }

    return res.status(200).json({
      message: "Seed brand updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to update seed brand." });
  }
};

export const deleteSeedBrand = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(AdminSeedBrand, id);
    if (!response?.success) {
      return res
        .status(404)
        .json({ message: response?.error || "Seed brand not found." });
    }

    return res
      .status(200)
      .json({ message: "Seed brand deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete seed brand." });
  }
};
