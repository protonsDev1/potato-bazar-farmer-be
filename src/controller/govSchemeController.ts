import { NotificationType } from "../database/models/notification";
import {
  createGovSchemeService,
  listGovSchemesService,
  getGovSchemeByIdService,
  updateGovSchemeService,
  deleteGovSchemeService,
} from "../services/govSchemeService";
import { sendNotificationService } from "../services/notificationService";

export const createGovScheme = async (req, res) => {
  try {
    const { id } = req.user;

    const result = await createGovSchemeService(req.body);

    await sendNotificationService({
      title: "New Government Scheme added",
      description: `A new government scheme "${result.data.title}" has been added. Check it out now!`,
      senderId: id,
      referenceType: NotificationType.GOV_SCHEME,
      referenceId: result.data.id,
      isBroadCast: true,
    });

    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const listGovSchemes = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      perPage = 10,
      governmentType,
      category,
      isActive,
    } = req.query;

    const result = await listGovSchemesService({
      search: search.toString(),
      page: Number(page),
      limit: Number(perPage),
      governmentType,
      category,
      isActive,
    });

    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getGovSchemeById = async (req, res) => {
  try {
    const result = await getGovSchemeByIdService(req.params.id);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateGovScheme = async (req, res) => {
  try {
    const result = await updateGovSchemeService(req.params.id, req.body);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteGovScheme = async (req, res) => {
  try {
    const result = await deleteGovSchemeService(req.params.id);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
