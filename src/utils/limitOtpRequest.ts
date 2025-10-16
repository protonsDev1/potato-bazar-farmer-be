import { Op } from "sequelize";
import Otp, { OTP_TYPE } from "../database/models/otp";

export const limitOtpMiddleware = async (req, res, next) => {
  try {
    const {
      mobile,
      newMobileNumber,
      email,
      otpType = OTP_TYPE.ON_BOARDING,
    } = req.body;
    const targetMobile = mobile || newMobileNumber;

    if (!targetMobile && !email) {
      return res.status(400).json({
        success: false,
        message: "A mobile number or an email address is required to proceed.",
      });
    }

    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

    const orConditions = [];
    if (email) orConditions.push({ email });
    if (targetMobile) orConditions.push({ mobile: targetMobile });

    const otps = await Otp.findAll({
      where: {
        [Op.or]: orConditions,
        otpType,
        createdAt: { [Op.gte]: twentyMinutesAgo },
      },
    });

    if (otps.length >= 3)
      return res.status(400).json({
        success: false,
        message: "Maximum otp request limit exceeded, try again later",
      });

    next();
  } catch (error) {
    console.error("Error finding OTPs:", error);
    throw new Error(`Error finding OTPs: ${error}`);
  }
};
