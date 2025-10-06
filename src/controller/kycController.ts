import {
  updateKycStatusInDB,
  listKycFromDB,
  getKycDetailFromDB,
  upsertKycForUser,
} from "../services/kycServices";

export const createKyc = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await upsertKycForUser(userId, req.body);

    return res.status(result.status).json({
      success: result.status < 400,
      message: result.message,
      kyc: result.kyc,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message || "Error creating KYC" });
  }
};

export const approveOrRejectKyc = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified, reason } = req.body;
    const updated = await updateKycStatusInDB(Number(id), isVerified, reason);
    return res.status(200).json({
      success: true,
      message: `KYC ${isVerified ? "approved" : "rejected"} successfully`,
      kyc: updated,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Error updating KYC status",
    });
  }
};

export const listKyc = async (req, res) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const search = req.query.search ? String(req.query.search) : undefined;
    const result = await listKycFromDB(Number(page), Number(limit), search);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Error fetching KYC list",
    });
  }
};

export const getKycDetail = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const kyc = await getKycDetailFromDB(id);

    if (!kyc) {
      return res
        .status(404)
        .json({ success: false, message: "KYC record not found" });
    }

    return res.json({ success: true, kyc });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Error fetching KYC detail",
    });
  }
};
