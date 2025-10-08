import { sendEmail } from "../services/emailService";
import { renderTemplate } from "../services/emailTemplate";
import {
  createSubAdminService,
  deleteSubAdminService,
  getSubAdminByIdService,
  listSubAdminsService,
  updateSubAdminService,
} from "../services/subAdminService";

export const createSubAdmin = async (req, res) => {
  try {
    const result = await createSubAdminService(req.body);
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

export const listSubAdmins = async (req, res) => {
  try {
    const { search = "", page = 1, perPage = 10 } = req.query;

    const result = await listSubAdminsService({
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

export const updateSubAdmin = async (req, res) => {
  try {
    const result = await updateSubAdminService(req.params.id, req.body);
    return res
      .status(result.statusCode)
      .json({ success: true, message: result.message, data: result.data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getSubAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getSubAdminByIdService(id);

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

export const deleteSubAdmin = async (req, res) => {
  try {
    const result = await deleteSubAdminService(req.params.id);
    return res
      .status(result.statusCode)
      .json({ success: true, message: result.message });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
