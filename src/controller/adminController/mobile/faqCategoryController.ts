import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";
import FaqCategory from "../../../database/models/adminModels/mobile/faqCategory";
import { generateTranslationsForRecord } from "../../../utils/translation";

export const addFaqCategory = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(FaqCategory, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Faq category with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "Faq category added successfully.",
        data: response.data,
      });
    }

    try {
      await generateTranslationsForRecord(response.data, {
        recordId: response.data.id,
        recordType: "FAQCategory",
        fields: ["name"],
      });
    } catch (err: any) {
      console.error(
        `[FAQ Category ${response.data.id}] Translation error:`,
        err?.message || err
      );
    }

    return res.status(400).json({ message: "Failed to add Faq category." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Faq category.",
    });
  }
};

export const getFaqCategory = async (req, res) => {
  try {
    const response = await getAllRecords(FaqCategory);

    if (response?.success) {
      return res.status(200).json({
        message: "Faq category fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No Faq category found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Faq category.",
    });
  }
};

export const getActiveFaqCategory = async (req, res) => {
  try {
    const response = await getActiveRecords(FaqCategory);

    if (response?.success) {
      return res.status(200).json({
        message: "Active Faq category fetched successfully.",
        data: response.data,
      });
    }

    return res.status(404).json({ message: "No active Faq category found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve active Faq category.",
    });
  }
};

export const updateFaqCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(FaqCategory, id, data, "name");

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Faq category with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Faq category record not found.",
      });
    }

    try {
      await generateTranslationsForRecord(response.data, {
        recordId: response.data.id,
        recordType: "FAQCategory",
        fields: ["name"],
      });
    } catch (err: any) {
      console.error(
        `[FAQ Category ${response.data.id}] Translation error:`,
        err?.message || err
      );
    }

    return res.status(200).json({
      message: "Faq category updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Faq category.",
    });
  }
};

export const deleteFaqCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(FaqCategory, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Faq category record not found.",
      });
    }

    return res.status(200).json({
      message: "Faq category deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Faq category.",
    });
  }
};
