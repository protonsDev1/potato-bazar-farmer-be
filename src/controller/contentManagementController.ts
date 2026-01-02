import ContentManagement from "../database/models/contentManagement";
import { createOrUpdateContentService } from "../services/createOrUpdateContentService";
import { generateTranslationsForRecord } from "../utils/translation";

export const createOrUpdateContent = async (req, res) => {
  try {
    const content = await createOrUpdateContentService(req.body);

    try {
      await generateTranslationsForRecord(content.data, {
        recordId: content.data.id,
        recordType: "ContentManagement",
        fields: ["title", "description"],
      });
    } catch (err: any) {
      console.error(
        `[Content Management ${content.data.id}] Translation error:`,
        err?.message || err
      );
    }

    return res.status(content.statusCode).json({
      success: true,
      message: content.message,
      data: content.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in create or update content.",
    });
  }
};

export const getAllContents = async (req, res) => {
  try {
    const contents = await ContentManagement.findAll({
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "All Contents fetched successfully.",
      data: contents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in retrieving all contents.",
    });
  }
};
