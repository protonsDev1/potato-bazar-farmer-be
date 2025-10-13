import CropDiagnosis from "../database/models/cropDiagnosis";
import { Op } from "sequelize";

export const createCropDiagnosisService = async (payload: any) => {
  const diagnosis = await CropDiagnosis.create(payload);
  return {
    success: true,
    statusCode: 201,
    message: "Crop diagnosis created successfully",
    data: diagnosis,
  };
};

export const listCropDiagnosisService = async ({
  userId,
  search = "",
  page = 1,
  limit = 10,
}: {
  userId: number;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const whereClause: any = { userId };

  if (search) {
    whereClause.disease = { [Op.iLike]: `%${search}%` };
  }

  const offset = (page - 1) * limit;

  const { rows, count } = await CropDiagnosis.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  return {
    success: true,
    statusCode: 200,
    message: "Crop diagnoses fetched successfully",
    data: {
      total: count,
      page,
      perPage: limit,
      diagnoses: rows,
    },
  };
};

export const getCropDiagnosisByIdService = async (id: number) => {
  const diagnosis = await CropDiagnosis.findOne({ where: { id } });
  if (!diagnosis) {
    return {
      success: false,
      statusCode: 404,
      message: "Crop diagnosis not found",
    };
  }
  return {
    success: true,
    statusCode: 200,
    message: "Crop diagnosis fetched successfully",
    data: diagnosis,
  };
};
