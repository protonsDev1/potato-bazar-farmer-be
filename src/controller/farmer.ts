import ExcelJS from "exceljs";

import Farmer from "../database/models/farmer";
import {
  onboardFarmer,
  retrieveFarmerProfile,
  getFarmerListByAdmin,
  updateFarmerDetails,
  createFarmerWorksheetColumns,
  addFarmersToWorksheet,
  deleteFarmerById,
  getAllFarmers,
} from "../services/farmerServices";
import {
  checkExistingUser,
  findUserByPkInDB,
  updateUserInDB,
} from "../services/userServices";
import { parseFilters } from "../utils/parseQuery";
import { createOtp, verifyOtpFromDB } from "../services/otpServices";
import { REGISTRATION_STATUS, USER_ROLES } from "../database/models/user";
import Trader from "../database/models/trader/trader";
import ColdStorage from "../database/models/coldStorage";
import Otp from "../database/models/otp";

export const createFarmer = async (req, res) => {
  try {
    const userId = req.user.id;
    req.body.onBoardedBy = userId;

    const user = await findUserByPkInDB(userId);
    if (!user.success) {
      return res.status(400).json({ message: user.error });
    }

    await updateUserInDB(req.body.userId, { name: req.body.name });
    const farmer = await onboardFarmer(req.body);
    return res.status(201).json({ message: "Farmer created", farmer });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to create farmer" });
  }
};

export const getProfileOverview = async (req, res) => {
  try {
    const farmerId = req.params.farmerId;

    const { role, id } = req.user;

    const farmer = await Farmer.findOne({
      where: { id: farmerId },
    });

    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    if (
      role !== USER_ROLES.ADMIN &&
      role !== USER_ROLES.SUB_ADMIN_WEB &&
      farmer.onBoardedBy !== id
    )
      return res.status(403).json({
        message:
          "Only Admins, Sub Admins or Agents who onboarded the trader are authorized to view this profile.",
      });

    let isWithin24Hours = true;

    if (role === "agent") {
      isWithin24Hours =
        Date.now() - new Date(farmer.createdAt).getTime() <=
        24 * 60 * 60 * 1000;
    }

    let farmerData = await retrieveFarmerProfile(farmerId, isWithin24Hours);

    return res.status(200).json({ message: farmerData });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to retrieve profile of farmer" });
  }
};

export const updateFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { role, id } = req.user;
    const payload = req.body;

    const farmer = await Farmer.findOne({
      where: { id: farmerId },
    });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    if (
      role !== USER_ROLES.ADMIN &&
      role !== USER_ROLES.AGENT &&
      role !== USER_ROLES.SUB_ADMIN_WEB
    ) {
      return res.status(403).json({
        message:
          "Only Admins, Sub Admins and Agents are authorized to update farmer profiles.",
      });
    }

    if (role === USER_ROLES.AGENT) {
      const isOnboardedByAgent = farmer.onBoardedBy === id;
      const isWithin24Hours =
        Date.now() - new Date(farmer.createdAt).getTime() <=
        24 * 60 * 60 * 1000;

      if (!isOnboardedByAgent || !isWithin24Hours) {
        return res.status(403).json({
          message:
            "Only Admins, Sub Admins or the Agent who onboarded the farmer within the last 24 hours can update the profile.",
        });
      }

      if (farmer.status === REGISTRATION_STATUS.APPROVED)
        return res.status(403).json({ message: "Farmer is already approved." });
    }

    await updateUserInDB(farmer.userId, { name: payload.name });

    const updatedFarmer = await updateFarmerDetails(farmerId, payload);
    return res
      .status(200)
      .json({ message: "Farmer updated successfully", farmer: updatedFarmer });
  } catch (err) {
    console.error("Update Farmer Error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Failed to update farmer" });
  }
};

export const getFarmerList = async (req, res) => {
  try {
    const { page, perPage: limit, search, sortBy } = req.query;

    const filters = parseFilters(req.query);

    if (req.user.role === USER_ROLES.SUB_ADMIN_WEB) {
      filters.status = REGISTRATION_STATUS.PENDING;
    }

    const farmerList = await getFarmerListByAdmin(
      page,
      limit,
      filters,
      search,
      sortBy
    );

    return res.status(200).json({
      message: "Farmer List",
      data: farmerList,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to get Farmer List" });
  }
};

export const selfOnboardFarmer = async (req, res) => {
  try {
    const userId = req.body.userId;
    req.body.onBoardedBy = userId;

    const user = await findUserByPkInDB(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    await updateUserInDB(req.body.userId, { name: req.body.name });

    const farmer = await onboardFarmer(req.body);

    return res
      .status(201)
      .json({ message: "Farmer self onboarded successfully.", farmer });
  } catch (error) {
    console.error("Controller Error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to self onboard farmer." });
  }
};

export const deleteFarmer = async (req, res) => {
  try {
    const result = await deleteFarmerById(req.params.id);
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }

    return res
      .status(200)
      .json({ success: true, message: "Farmer deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Failed to delete farmer",
    });
  }
};

export const exportFarmers = async (req, res) => {
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
    const farmers = await getAllFarmers(filters, search);

    if (!farmers.length) {
      return res.status(404).json({ message: "No farmers found." });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Farmers");

    createFarmerWorksheetColumns(worksheet);
    await addFarmersToWorksheet(farmers, worksheet);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=farmers.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Farmer export error:", error);
    res
      .status(500)
      .json({ message: "Failed to export farmers", error: error.message });
  }
};

export const requestUpdateFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { newMobileNumber } = req.body;

    const farmer = await Farmer.findOne({
      where: { id: farmerId },
    });
    if (!farmer)
      return res
        .status(404)
        .json({ success: false, message: "Farmer not found" });

    if (farmer.optionalNumber === newMobileNumber) {
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

export const verifyUpdateFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { newMobileNumber, otp } = req.body;

    const farmer = await Farmer.findOne({
      where: { id: farmerId },
      attributes: ["id", "userId"],
    });

    if (!farmer) {
      return res
        .status(404)
        .json({ success: false, message: "Farmer not found" });
    }

    const isValid = await verifyOtpFromDB(newMobileNumber, otp);
    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    const updates = [
      Farmer.update(
        { optionalNumber: newMobileNumber },
        { where: { id: farmerId } }
      ),
      updateUserInDB(farmer.userId, { mobile: newMobileNumber }),
      Trader.update(
        { mobileNumber: newMobileNumber },
        { where: { userId: farmer.userId } }
      ),
      ColdStorage.update(
        { mobileNumber: newMobileNumber },
        { where: { userId: farmer.userId } }
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
