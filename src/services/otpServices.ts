import Otp from '../database/models/otp';

export const createOtp = async (mobile: string) => {
  const otp = '1234'; 
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

  return await Otp.create({ mobile, otp, expiresAt });
};

export const verifyOtpFromDB = async (mobile: string, otp: string): Promise<boolean> => {
  const record = await Otp.findOne({ where: { mobile, otp, isUsed: false } });

  if (!record || record.expiresAt < new Date()) return false;

  record.isUsed = true;
  await record.save();
  return true;
};
