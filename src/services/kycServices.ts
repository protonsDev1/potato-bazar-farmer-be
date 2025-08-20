import KycDocument from '../database/models/kycDocuments';
import User from '../database/models/user';
import { Op } from 'sequelize';

export const createKycInDB = async (kycData: any) => {
  return await KycDocument.create(kycData);
};

export const updateKycStatusInDB = async (kycId: number, status: boolean) => {
  const kyc = await KycDocument.findByPk(kycId);
  if (!kyc) throw new Error("KYC record not found");
  const applicationStatus = status ? 'approved' : 'rejected';
  kyc.isVerified = status;
  kyc.status=applicationStatus;
  await kyc.save();
  return kyc;
};

export const listKycFromDB = async (page: number, limit: number, search?: string) => {
  const offset = (page - 1) * limit;

  const whereCondition: any = {};

  if (search) {
    whereCondition["$user.name$"] = {
      [Op.iLike]: `%${search}%`  
    };
  }

  const { rows, count } = await KycDocument.findAndCountAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "mobile", "role"]
      }
    ],
    where: whereCondition,
    offset,
    limit,
    order: [["createdAt", "DESC"]]
  });

  return {
    total: count,
    page,
    limit,
    data: rows
  };
};

export const getKycDetailFromDB = async (id: number) => {
  const kyc = await KycDocument.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "mobile", "role"]
      }
    ]
  });

  return kyc;
};

