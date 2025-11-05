import { NotificationType } from "../database/models/notification";
import {
  createNewsService,
  listNewsService,
  getNewsByIdService,
  updateNewsService,
  deleteNewsService,
} from "../services/newsService";
import { sendNotificationService } from "../services/notificationService";

export const createNews = async (req, res) => {
  try {
    const { images } = req.body;
    const { id } = req.user;

    if (!Array.isArray(images) || images.length === 0)
      return res.status(400).json({
        success: false,
        message: "At least one image is required to create a news post.",
      });

    req.body.createdBy = req.user.role;
    const result = await createNewsService(req.body);

    await sendNotificationService({
      title: "New Update from Potato Bazaar",
      description: `A new news post "${req.body.title}" has just been published. Check it out for the latest updates!`,
      senderId: id,
      referenceType: NotificationType.NEWS,
      referenceId: result.data.id,
      isBroadCast: true,
    });

    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const listNews = async (req, res) => {
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
    const result = await listNewsService({
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

export const getNewsById = async (req, res) => {
  try {
    const result = await getNewsByIdService(req.params.id, req.user);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const result = await updateNewsService(req.params.id, req.body);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const result = await deleteNewsService(req.params.id);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createNewsAI = async (req, res) => {
  try {
    const result = await createNewsService(req.body);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
