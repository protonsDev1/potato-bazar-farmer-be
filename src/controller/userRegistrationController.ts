import ExcelJS from "exceljs";

import UserRegistration from "../database/models/userRegistration";
import { createOtp, verifyOtpFromDB } from "../services/otpServices";
import { Op } from "sequelize";

export const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    const isUserAlreadyExist = await UserRegistration.findOne({
      where: { mobile },
    });

    if (isUserAlreadyExist) {
      return res.status(403).json({
        success: false,
        message: "User with this mobile number already exists.",
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
        message: "User with this mobile number already exists.",
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
