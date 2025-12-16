import ExcelJS from "exceljs";

import UserRegistration from "../database/models/userRegistration";
import { createOtp, verifyOtpFromDB } from "../services/otpServices";
import { Op } from "sequelize";
import AppVersions from "../database/models/appVersion";

export const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile)
      return res
        .status(400)
        .json({ success: false, message: "Mobile is required." });

    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number.",
      });
    }

    const isUserAlreadyExist = await UserRegistration.findOne({
      where: { mobile },
    });

    if (isUserAlreadyExist) {
      return res.status(403).json({
        success: false,
        message:
          "The mobile number you entered is already registered. Please use a different number.",
      });
    }

    await createOtp(mobile);
    return res
      .status(200)
      .json({ success: true, message: "OTP has been sent successfully." });
  } catch (err: any) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Failed to send OTP" });
  }
};

export const verifyAndRegister = async (req, res) => {
  try {
    const { mobile, otp, fullName, villageOrCity, state, district } = req.body;

    const isValid = await verifyOtpFromDB(mobile, otp);
    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    const isUserAlreadyExist = await UserRegistration.findOne({
      where: { mobile },
    });

    if (isUserAlreadyExist) {
      return res.status(403).json({
        success: false,
        message:
          "The mobile number you entered is already registered. Please use a different number.",
      });
    }

    const user = await UserRegistration.create({
      mobile,
      fullName,
      villageOrCity,
      state,
      district,
    });

    return res
      .status(200)
      .json({ message: "User Registration is successfull.", data: user });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to register user",
    });
  }
};

const createUserRegistrationWorksheetColumns = (worksheet) => {
  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Full Name", key: "fullName", width: 25 },
    { header: "Mobile", key: "mobile", width: 20 },
    { header: "Village/City", key: "villageOrCity", width: 25 },
    { header: "District", key: "district", width: 20 },
    { header: "State", key: "state", width: 20 },
    { header: "Created At", key: "createdAt", width: 25 },
  ];
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
};

const addUserRegistrationsToWorksheet = (records, worksheet) => {
  records.forEach((record) => {
    worksheet.addRow({
      id: record.id,
      fullName: record.fullName,
      mobile: record.mobile,
      villageOrCity: record.villageOrCity || "",
      district: record.district || "",
      state: record.state || "",
      createdAt: record.createdAt.toISOString().split("T")[0],
    });
  });
};

export const getAndExportAllUserRegistrations = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.perPage || "10");

    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const {
      state,
      district,
      dateFrom,
      dateTo,
      export: exportFlag = false,
    } = req.query;

    const whereCondition: any = {};

    if (search) {
      whereCondition[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { mobile: { [Op.iLike]: `%${search}%` } },
        { villageOrCity: { [Op.iLike]: `%${search}%` } },
        { district: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (state && state.toLowerCase() !== "all") {
      whereCondition.state = { [Op.iLike]: state };
    }
    if (district && district.toLowerCase() !== "all") {
      whereCondition.district = { [Op.iLike]: district };
    }
    if (dateFrom && dateTo) {
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);

      whereCondition.createdAt = {
        [Op.between]: [from, to],
      };
    } else if (dateFrom) {
      whereCondition.createdAt = { [Op.gte]: new Date(dateFrom) };
    } else if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);

      whereCondition.createdAt = { [Op.lte]: to };
    }

    const { rows, count } = await UserRegistration.findAndCountAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      limit: exportFlag ? undefined : limit,
      offset: exportFlag ? undefined : offset,
    });

    if (exportFlag === "true") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("User Registrations");
      createUserRegistrationWorksheetColumns(worksheet);
      addUserRegistrationsToWorksheet(rows, worksheet);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=user_registrations.xlsx"
      );
      await workbook.xlsx.write(res);
      return res.end();
    }

    return res.status(200).json({
      success: true,
      total: count,
      page,
      perPage: limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user registrations",
      error: error.message,
    });
  }
};

export const deleteUserRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const userRegistration = await UserRegistration.findByPk(id);
    if (!userRegistration) {
      return res
        .status(404)
        .json({ success: false, message: "User Registration not found" });
    }

    await userRegistration.destroy();
    return res.status(200).json({
      success: true,
      message: "User Registration deleted successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message || "Failed in deleting user registration.",
      });
  }
};
export const upsertAppVersion = async (req, res) => {
  try {
    const { deviceType, version, versionCode } = req.body;


    const existingVersion = await AppVersions.findOne({
      where: { deviceType },
    });

    if (existingVersion) {
      await existingVersion.update({
        version,
        versionCode,
      });

      return res.status(200).json({
        success: true,
        message: `${deviceType} app version updated successfully`,
        data: existingVersion,
      });
    }

    const newVersion = await AppVersions.create({
      deviceType,
      version,
      versionCode,
    });

    return res.status(201).json({
      success: true,
      message: `${deviceType} app version created successfully`,
      data: newVersion,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to add/update app version",
    });
  }
};
export const matchAppVersion = async (req, res) => {
  try {

    const { deviceType, version, versionCode } = req.query;
    if (!deviceType || !version || !versionCode) {
      return res.status(400).json({
        success: false,
        message: "deviceType, version and versionCode are required",
      });
    }

    if (!["android", "ios"].includes(deviceType)) {
      return res.status(400).json({
        success: false,
        message: "deviceType must be android or ios",
      });
    }


   const appVersion = await AppVersions.findOne({
  where: {
    deviceType,
    version,
    versionCode: Number(versionCode),
  },
});

let isForceUpdate: boolean;

if (appVersion) {
  isForceUpdate = true;
} else {
  isForceUpdate = false;
}

return res.status(200).json({
  success: true,
  data: {
    deviceType,
    version,
    versionCode: Number(versionCode),
    isForceUpdate,
  },
});
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to match app version",
    });
  }
};


