import { NotificationType } from "../database/models/notification";
import {
  createKnowledgeHubService,
  deleteKnowledgeHubService,
  getKnowledgeHubsByIdService,
  listKnowledgeHubService,
  updateKnowledgeHubService,
} from "../services/knowledgeHubService";
import { sendNotificationService } from "../services/notificationService";

export const createKnowledgeHub = async (req, res) => {
  try {
    const { images } = req.body;
    const { id } = req.user;

    if (!Array.isArray(images) || images.length === 0)
      return res.status(400).json({
        success: false,
        message:
          "At least one image is required to create a knowledge hub post.",
      });

    req.body.createdBy = req.user.role;
    const result = await createKnowledgeHubService(req.body);

    await sendNotificationService({
      title: "New Knowledge Hub post is added in Potato Bazaar",
      description: `A new Knowledge Hub post "${req.body.title}" has just been published. Check it out for the latest updates!`,
      senderId: id,
      referenceType: NotificationType.KNOWLEDGE_HUB,
      referenceId: result.data.id,
      isBroadCast: true,
    });

    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const listKnowledgeHubs = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      perPage = 10,
      category,
      status,
      isFeatured,
      stateId,
      districtId,
      date,
    } = req.query;
    const result = await listKnowledgeHubService({
      search: search.toString(),
      page: Number(page),
      limit: Number(perPage),
      category,
      status,
      isFeatured,
      stateId,
      districtId,
      date,
    });
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getKnowledgeHubById = async (req, res) => {
  try {
    const result = await getKnowledgeHubsByIdService(req.params.id, req.user);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateKnowledgeHub = async (req, res) => {
  try {
    const result = await updateKnowledgeHubService(req.params.id, req.body);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteKnowledgeHub = async (req, res) => {
  try {
    const result = await deleteKnowledgeHubService(req.params.id);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
