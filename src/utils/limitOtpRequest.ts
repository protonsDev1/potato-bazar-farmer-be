import { Op } from "sequelize";
import Otp from "../database/models/otp";

export const limitOtpMiddleware = async (req, res, next) => {
  try {
    const { mobile, newMobileNumber } = req.body;
    const targetMobile = mobile || newMobileNumber;

    if (!targetMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required.",
      });
    }

    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

    const otps = await Otp.findAll({
      where: {
        mobile: targetMobile,
        createdAt: { [Op.gte]: twentyMinutesAgo },
      },
    });

    if (otps.length >= 5)
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
