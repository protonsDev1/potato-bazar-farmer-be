import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";

import AdvertisementService from "../../../database/models/adminModels/mobile/advertisementService";
import { generateTranslationsForRecord } from "../../../utils/translation";

export const addAdvertisementService = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(AdvertisementService, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Advertisement Service with this name already exists.",
      });
    }

    try {
      await generateTranslationsForRecord(response.data, {
        recordId: response.data.id,
        recordType: "advertisementService",
        fields: ["name", "subName"],
        dateFields: [{ key: "createdAt" }],
      });
    } catch (error) {
      console.error("Error in translating advertisement services", error);
    }

    if (response?.success) {
      return res.status(201).json({
        message: "Advertisement Service added successfully.",
        data: response.data,
      });
    }

    return res
      .status(400)
      .json({ message: "Failed to add Advertisement Service." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Advertisement Service.",
    });
  }
};

export const getAdvertisementService = async (req, res) => {
  try {
    const response = await getAllRecords(AdvertisementService);

    if (response?.success) {
      return res.status(200).json({
        message: "Advertisement Services fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Advertisement Service found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Advertisement Service.",
    });
  }
};

export const getActiveAdvertisementService = async (req, res) => {
  try {
    const response = await getActiveRecords(AdvertisementService);

    if (response?.success) {
      return res.status(200).json({
        message: "Active Advertisement Services fetched successfully.",
        data: response.data,
      });
    }

    return res
      .status(404)
      .json({ message: "No active Advertisement Service found." });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Failed to retrieve active Advertisement Services.",
    });
  }
};

export const updateAdvertisementService = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(AdvertisementService, id, data, "name");

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Advertisement Service with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Advertisement Service record not found.",
      });
    }

    try {
      await generateTranslationsForRecord(response.data, {
        recordId: response.data.id,
        recordType: "advertisementService",
        fields: ["name", "subName"],
        dateFields: [{ key: "createdAt" }],
      });
    } catch (error) {
      console.error("Error in translating advertisement services", error);
    }

    return res.status(200).json({
      message: "Advertisement Service updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Advertisement Service.",
    });
  }
};

export const deleteAdvertisementService = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(AdvertisementService, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Advertisement Service record not found.",
      });
    }

    return res.status(200).json({
      message: "Advertisement Service deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Advertisement Service.",
    });
  }
};
