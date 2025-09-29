import ExcelJS from "exceljs";

import ColdStorage from "../database/models/coldStorage";
import {
  onboardColdStorage,
  retrieveColdStorageProfile,
  getColdStorage,
  updateColdStorageService,
  deleteColdStorageById,
  createColdStorageWorksheetColumns,
  addColdStoragesToWorksheet,
  getAllColdStorages,
  likeOrDislikeService,
  canUpdateColdStorage,
} from "../services/coldStorageService";
import {
  checkExistingUser,
  findUserByPkInDB,
  updateUserInDB,
} from "../services/userServices";
import { parseFilters } from "../utils/parseQuery";
import { createOtp, verifyOtpFromDB } from "../services/otpServices";
import { REGISTRATION_STATUS, USER_ROLES } from "../database/models/user";
import Farmer from "../database/models/farmer";
import Trader from "../database/models/trader/trader";
import Otp from "../database/models/otp";

export const createColdStorage = async (req, res) => {
  try {
    const onBoardedBy = req.user.id;
    req.body.onBoardedBy = onBoardedBy;

    const user = await findUserByPkInDB(onBoardedBy);
    if (!user.success) {
      return res.status(400).json({ message: user.error });
    }

    await updateUserInDB(req.body.userId, { ownerName: req.body.ownerName });

    const coldStorage = await onboardColdStorage(req.body);
    res.status(201).json({
      message: "Cold Storage onboarded successfully",
      data: coldStorage,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to onboard cold storage" });
  }
};

export const updateColdStorage = async (req, res) => {
  try {
    const { coldStorageId } = req.params;
    const { role, id } = req.user;
    const payload = req.body;

    const coldStorage = await ColdStorage.findOne({
      where: { id: coldStorageId },
    });
    if (!coldStorage) {
      return res.status(404).json({ message: "Cold storage not found" });
    }

    if (
      role !== USER_ROLES.ADMIN &&
      role !== USER_ROLES.AGENT &&
      role !== USER_ROLES.SUB_ADMIN_WEB
    ) {
      return res.status(403).json({
        message:
          "Only Admins, Sub Admins and Agents are authorized to update cold storage profiles.",
      });
    }

    if (role === USER_ROLES.AGENT) {
      const isOnboardedByAgent = coldStorage.onBoardedBy === id;
      const isWithin24Hours =
        Date.now() - new Date(coldStorage.createdAt).getTime() <=
        24 * 60 * 60 * 1000;

      if (!isOnboardedByAgent || !isWithin24Hours) {
        return res.status(403).json({
          message:
            "Only Admins, Sub Admins or the Agent who onboarded the cold storage within the last 24 hours can update the profile.",
        });
      }
    }

    if (payload.ownerName && coldStorage.userId) {
      await updateUserInDB(coldStorage.userId, { name: payload.ownerName });
    }

    const updatedColdStorage = await updateColdStorageService(
      coldStorageId,
      payload
    );

    return res.status(200).json({
      message: "Cold Storage updated successfully",
      data: updatedColdStorage,
    });
  } catch (err) {
    console.error("Update Cold Storage Error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Failed to update cold storage" });
  }
};

export const getColdStorageProfile = async (req, res) => {
  try {
    const coldStorageId = req.params.id;

    const { id: userId, role } = req.user;

    const coldStorage = await ColdStorage.findOne({
      where: { id: coldStorageId },
    });

    let isWithin24Hours = true;

    if (role === "agent") {
      isWithin24Hours =
        Date.now() - new Date(coldStorage.createdAt).getTime() <=
        24 * 60 * 60 * 1000;
    }

    const profileDetails = await retrieveColdStorageProfile(
      coldStorageId,
      isWithin24Hours,
      userId,
      role
    );

    return res.status(200).json({ success: true, message: profileDetails });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to retrieve cold storage profile.",
    });
  }
};

export const getColdStorageList = async (req, res) => {
  try {
    const { page, perPage: limit, search, sortBy, listingType } = req.query;
    const { id: userId } = req.user;

    const filters = parseFilters(req.query);

    if (req.user.role === USER_ROLES.SUB_ADMIN_WEB) {
      filters.status = REGISTRATION_STATUS.PENDING;
    }

    const coldStorage = await getColdStorage(
      page,
      limit,
      filters,
      search,
      userId,
      sortBy,
      listingType
    );

    return res.status(200).json({
      success: true,
      message: "Cold storage list",
      data: coldStorage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to retrieve cold storage list",
    });
  }
};

export const selfOnboardColdStorage = async (req, res) => {
  try {
    const onBoardedBy = req.body.userId;
    req.body.onBoardedBy = onBoardedBy;

    const user = await findUserByPkInDB(onBoardedBy);
    if (!user.success) {
      return res.status(400).json({ message: user.error });
    }

    await updateUserInDB(req.body.userId, { ownerName: req.body.ownerName });

    const selfOnboard = await onboardColdStorage(req.body);
    res.status(201).json({
      message: "Cold Storage self onboarded successfully",
      data: selfOnboard,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to self onboard cold storage",
    });
  }
};

export const deleteColdStorage = async (req, res) => {
  try {
    const result = await deleteColdStorageById(req.params.id);
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }

    return res
      .status(200)
      .json({ success: true, message: "Cold Storage deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Failed to delete cold storage",
    });
  }
};

export const exportColdStorages = async (req, res) => {
  try {
    const { mobile, mobileOtp, secondaryMobile, secondaryMobileOtp } = req.body;

    const isPrimaryValid = await verifyOtpFromDB(mobile, mobileOtp, false);
    const isSecondaryValid = await verifyOtpFromDB(
      secondaryMobile,
      secondaryMobileOtp,
      false
    );

    if (!isPrimaryValid && !isSecondaryValid) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired OTPs for both primary and secondary mobile",
      });
    }
    if (!isPrimaryValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP for primary mobile",
      });
    }
    if (!isSecondaryValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP for secondary mobile",
      });
    }

    await Otp.destroy({ where: { mobile: [mobile, secondaryMobile] } });

    const filters = parseFilters(req.query);
    const search = req.query.search || "";

    const coldStorages = await getAllColdStorages(filters, search);

    if (!coldStorages.length) {
      return res.status(404).json({ message: "No cold storages found." });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Cold Storages");

    createColdStorageWorksheetColumns(worksheet);
    await addColdStoragesToWorksheet(coldStorages, worksheet);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=cold_storages.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Cold Storage export error:", error);
    res.status(500).json({
      message: "Failed to export cold storages",
      error: error.message,
    });
  }
};

export const likeOrDislikeColdStorage = async (req, res) => {
  try {
    const { id } = req.user;
    const { coldStorageId } = req.params;

    const response = await likeOrDislikeService(id, coldStorageId);

    if (!response.success)
      return res.status(400).json({ message: response.error });

    return res.status(200).json({ message: response.data });
  } catch (error) {
    console.error("Like or dislike coldStorage error:", error);
    res.status(500).json({
      message: "Failed to like or dislike cold storages",
      error: error.message,
    });
  }
};

export const requestUpdateCS = async (req, res) => {
  try {
    const { coldStorageId } = req.params;
    const { newMobileNumber } = req.body;

    const coldStorage = await ColdStorage.findOne({
      where: { id: coldStorageId },
    });
    if (!coldStorage)
      return res
        .status(404)
        .json({ success: false, message: "Cold Storage not found" });

    if (coldStorage.mobileNumber === newMobileNumber) {
      return res.status(400).json({
        success: false,
        message: "New mobile number is same as the current one",
      });
    }

    const existingUser = await checkExistingUser(newMobileNumber);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already in use by another user",
      });
    }

    await createOtp(newMobileNumber);

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${newMobileNumber}. Please verify to update mobile number.`,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to request mobile update" });
  }
};

export const verifyUpdateCS = async (req, res) => {
  try {
    const { coldStorageId } = req.params;
    const { newMobileNumber, otp } = req.body;

    const coldStorage = await ColdStorage.findOne({
      where: { id: coldStorageId },
      attributes: ["id", "userId"],
    });

    if (!coldStorage) {
      return res
        .status(404)
        .json({ success: false, message: "Cold Storage not found" });
    }

    const isValid = await verifyOtpFromDB(newMobileNumber, otp);
    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    const updates = [
      ColdStorage.update(
        { mobileNumber: newMobileNumber },
        { where: { id: coldStorage.userId } }
      ),
      updateUserInDB(coldStorage.userId, { mobile: newMobileNumber }),
      Farmer.update(
        { optionalNumber: newMobileNumber },
        { where: { userId: coldStorage.userId } }
      ),
      Trader.update(
        { mobileNumber: newMobileNumber },
        { where: { userId: coldStorage.userId } }
      ),
    ];

    await Promise.all(updates);

    return res.status(200).json({
      success: true,
      message: "Mobile number updated successfully",
      newMobileNumber,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to verify mobile update" });
  }
};

export const updateColdStorageAvailability = async (req, res) => {
  try {
    const { coldStorageId } = req.params;
    const { isAvailable } = req.body;

    const coldStorage = await ColdStorage.findByPk(coldStorageId);

    if (!coldStorage) {
      return res.status(404).json({ message: "Cold storage not found" });
    }

    const hasAccess = await canUpdateColdStorage(req.user, coldStorage);

    if (!hasAccess) {
      return res.status(403).json({
        message:
          "Only the owner, a super admin, or an authorized sub admin can update availability.",
      });
    }

    coldStorage.isAvailable = isAvailable;
    await coldStorage.save();

    return res.status(200).json({
      message: "Cold storage availability updated successfully",
      data: { id: coldStorage.id, isAvailable: coldStorage.isAvailable },
    });
  } catch (err) {
    console.error("Update Availability Error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Failed to update availability" });
  }
};
