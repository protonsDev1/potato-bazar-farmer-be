import KycDocument from "../database/models/kycDocuments";
import { NotificationType } from "../database/models/notification";
import User, { USER_ROLES } from "../database/models/user";
import {
  updateKycStatusInDB,
  listKycFromDB,
  getKycDetailFromDB,
  upsertKycForUser,
} from "../services/kycServices";
import { sendNotificationService } from "../services/notificationService";

export const upsertKyc = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await upsertKycForUser(userId, req.body);

    const superAdmin = await User.findOne({
      where: { role: USER_ROLES.SUPER_ADMIN },
    });

    const displayName =
      (result.kyc && result.kyc.user && result.kyc.user.firstName &&
        result.kyc.user.lastName &&
        `${result.kyc.user.firstName} ${result.kyc.user.lastName}`) ||
      result.kyc.user.name ||
      "the user";

    await sendNotificationService({
      title: "New KYC Request Submitted",
      description: `A new KYC request has been submitted by ${displayName}. Please review and verify the details.`,
      senderId: userId,
      receiverId: superAdmin.id,
      referenceType: NotificationType.KYC,
      referenceId: result.kyc.id,
    });

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
    const { id: adminId } = req.user;

    const description = isVerified
      ? "You may now proceed with all platform features that require KYC verification."
      : `We could not approve your KYC request. Reason: ${
          updated.reason as string
        }`;

    await sendNotificationService({
      title: `Your KYC Request is ${updated.status}`,
      description,
      senderId: adminId,
      receiverId: updated.userId,
      referenceType: NotificationType.KYC,
      referenceId: id,
    });

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
    const status = req.query.status
      ? String(req.query.status).toLowerCase()
      : undefined;

    const result = await listKycFromDB(
      Number(page),
      Number(limit),
      search,
      status
    );
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

export const getMyKycDetail = async (req, res) => {
  try {
    const userId = req.user.id;

    const kyc = await KycDocument.findOne({ where: { userId } });

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: "You have not submitted your KYC yet.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "KYC details fetched successfully",
      data: kyc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching KYC details",
    });
  }
};
