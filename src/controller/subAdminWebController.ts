import { sendEmail } from "../services/emailService";
import { renderTemplate } from "../services/emailTemplate";
import {
  createSubAdminWebService,
  deleteSubAdminWebService,
  getSubAdminWebByIdService,
  listSubAdminWebsService,
  updateSubAdminWebService,
} from "../services/subAdminWebService";

export const createSubAdminWeb = async (req, res) => {
  try {
    const result = await createSubAdminWebService(req.body);
    if (!result) {
      return res
        .status(result.statusCode)
        .json({ success: false, message: result.message });
    }

    const subAdmin = result.data;

    if (subAdmin.email) {
      const html = renderTemplate("subAdminCredentials", {
        name: subAdmin.name,
        email: subAdmin.email,
        password: req.body.password,
      });

      sendEmail({
        to: subAdmin.email,
        subject: "Your Sub Admin Account Credentials",
        html,
      });
    }

    return res
      .status(result.statusCode)
      .json({ success: true, message: result.message, data: result.data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const listSubAdminWebs = async (req, res) => {
  try {
    const { search = "", page = 1, perPage = 10 } = req.query;

    const result = await listSubAdminWebsService({
      search: search.toString(),
      page: Number(page),
      limit: Number(perPage),
    });

    return res
      .status(result.statusCode)
      .json({ success: true, message: result.message, data: result.data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSubAdminWeb = async (req, res) => {
  try {
    const result = await updateSubAdminWebService(req.params.id, req.body);
    return res
      .status(result.statusCode)
      .json({ success: true, message: result.message, data: result.data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getSubAdminWebById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getSubAdminWebByIdService(id);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteSubAdminWeb = async (req, res) => {
  try {
    const result = await deleteSubAdminWebService(req.params.id);
    return res
      .status(result.statusCode)
      .json({ success: true, message: result.message });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
