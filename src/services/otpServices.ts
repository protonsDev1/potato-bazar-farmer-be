import axios from "axios";
import bcrypt from "bcrypt";
import { randomInt } from "crypto";

import Otp from "../database/models/otp";

const generateOtp = () => String(randomInt(0, 1_000_000)).padStart(6, "0");

const sendOtpService = async (mobile, otp) => {
  try {
    const data = {
      template_id: process.env.MSG91_TEMPLATE_ID,
      short_url: "0",
      recipients: [
        {
          mobiles: "91" + mobile,
          var1: otp,
        },
      ],
    };

    const headers = {
      authkey: process.env.MSG91_AUTH_KEY,
      "content-type": "application/json",
    };

    const res = await axios.post(process.env.MSG91_BASE_URL, data, {
      headers,
    });
    return res.data;
  } catch (err) {
    console.error("MSG91 OTP send failed:", err.response?.data || err.message);
    throw new Error("Failed to send OTP");
  }
};

export const createOtp = async (mobile: string) => {
  let otp: string;

  if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "staging"
  ) {
    otp = generateOtp();
    await sendOtpService(mobile, otp);
  } else {
    otp = "123456";
  }

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const hashedOtp = await bcrypt.hash(otp, 10);

  await Otp.create({ mobile, otpHash: hashedOtp, expiresAt });
};

export const verifyOtpFromDB = async (
  mobile: string,
  otp: string,
  consume = true
): Promise<boolean> => {
  const record = await Otp.findOne({
    where: { mobile },
    order: [["createdAt", "DESC"]],
  });
  if (!record || record.expiresAt < new Date()) return false;

  const isMatch = await bcrypt.compare(otp, record.otpHash);
  if (!isMatch) return false;

  if (consume) {
    await Otp.destroy({ where: { mobile } });
  }

  return true;
};
