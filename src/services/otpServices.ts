import Otp from '../database/models/otp';

export const createOtp = async (mobile: string) => {
  const otp = '123456'; 
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

  return await Otp.create({ mobile, otp, expiresAt });
};

export const verifyOtpFromDB = async (mobile: string, otp: string): Promise<boolean> => {
  const record = await Otp.findOne({ where: { mobile, otp},order: [['createdAt', 'DESC']], });
  if (!record || record.expiresAt < new Date()) return false;

  await Otp.destroy({ where: {mobile} });

  return true;
};
