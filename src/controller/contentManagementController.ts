import ContentManagement from "../database/models/contentManagement";
import { createOrUpdateContentService } from "../services/createOrUpdateContentService";

export const createOrUpdateContent = async (req, res) => {
  try {
    const content = await createOrUpdateContentService(req.body);

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
