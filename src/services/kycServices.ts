import KycDocument from '../database/models/kycDocuments';
import User from '../database/models/user';
import { Op } from 'sequelize';
interface UpsertKycResult {
  status: number;
  message: string;
  kyc?: KycDocument;
}

export const upsertKycForUser = async (
  userId: number,
  kycData: any
): Promise<UpsertKycResult> => {
  return await KycDocument.sequelize!.transaction(async (t) => {
    const kyc = await KycDocument.findOne({
      where: { userId },
      transaction: t,
    });

    if (kyc) {
      if (kyc.isVerified) {
        return {
          status: 400,
          message: "KYC already verified. You cannot update it.",
          kyc,
        };
      }

      const updatedKyc = await kyc.update(
        {
          ...kycData,
          isVerified: false,
          status: "pending",
        },
        { transaction: t }
      );

      return {
        status: 200,
        message: "KYC updated successfully",
        kyc: updatedKyc,
      };
    }

    const newKyc = await KycDocument.create(
      {
        userId,
        ...kycData,
        isVerified: false,
        status: "pending",
      },
      { transaction: t }
    );

    return {
      status: 201,
      message: "KYC created successfully",
      kyc: newKyc,
    };
  });
};

export const createKycInDB = async (kycData: any) => {
  return await KycDocument.create(kycData);
};

export const updateKycStatusInDB = async (kycId: number, status: boolean,reason?:string) => {
  const kyc = await KycDocument.findByPk(kycId);
  if (!kyc) throw new Error("KYC record not found");
  const applicationStatus = status ? 'approved' : 'rejected';
  kyc.isVerified = status;
  kyc.status=applicationStatus;
  if (reason !== undefined && reason !== null && reason.trim() !== "") {
    kyc.reason = reason;
  }
  
  await kyc.save();
  return kyc;
};

export const listKycFromDB = async (
  page: number,
  limit: number,
  search?: string,
  status?: string
) => {
  const offset = (page - 1) * limit;

  const whereCondition: any = {};

  if (status) {
    whereCondition.status = status;
  }

  if (search) {
    whereCondition[Op.or] = [
      { "$user.name$": { [Op.iLike]: `%${search}%` } },
      { "$user.mobile$": { [Op.iLike]: `%${search}%` } },
      { gstNumber: { [Op.iLike]: `%${search}%` } },
      { fssaiNumber: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows, count } = await KycDocument.findAndCountAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "mobile", "role"],
      },
    ],
    where: whereCondition,
    offset,
    limit,
    order: [["updatedAt", "DESC"]],
  });

  return {
    total: count,
    page,
    limit,
    data: rows,
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

