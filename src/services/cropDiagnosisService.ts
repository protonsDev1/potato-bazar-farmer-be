import Brand from "../database/models/Brand";
import CropDiagnosis from "../database/models/cropDiagnosis";
import { Op } from "sequelize";
import Product from "../database/models/Product";
import Endorsement from "../database/models/Endorsement";

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

export const createEndorsementService = async (payload: any) => {
  const {
    brandName,
    productName,
    title,
    headline,
    disease,
    cta_text,
    cta_url,
    start_at,
    end_at,
    status,
    image,
    notes,
    sort_order,
  } = payload;

  // ✅ Find or create Brand
  let brand = await Brand.findOne({ where: { name: brandName } });

  if (!brand) {
    brand = await Brand.create({
      name: brandName,
    });
  }

  // ✅ Find or create Product under Brand
  let product = await Product.findOne({
    where: { name: productName, brand_id: brand.id },
  });

  if (!product) {
    product = await Product.create({
      name: productName,
      brand_id: brand.id,
    });
  }

  // ✅ Create Endorsement (ID auto-generated)
  const endorsement = await Endorsement.create({
    brand_id: brand.id,
    product_id: product.id,
    title,
    headline,
    disease,
    cta_text,
    cta_url,
    start_at,
    end_at,
    status,
    image,
    notes,
    sort_order,
  });

  return {
    success: true,
    statusCode: 201,
    message: "Endorsement created successfully",
    data: endorsement,
  };
};

export const getEndorsementsService = async ({
  page,
  limit,
  disease
}: {
  page: number;
  limit: number;
  disease?: string | null;
}) => {
  const offset = (page - 1) * limit;

  const where: any = {};

  if (disease) {
    where.disease = {
      [Op.overlap]: [disease.toLowerCase()]
    };
  }

  const { rows, count } = await Endorsement.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      { model: Brand },
      { model: Product }
    ]
  });

  return {
    success: true,
    statusCode: 200,
    message: "Endorsements fetched successfully",
    data: {
      endorsements: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    },
  };
};

export const updateEndorsementService = async (id: number, payload: any) => {
  const endorsement = await Endorsement.findByPk(id);

  if (!endorsement) {
    return {
      success: false,
      statusCode: 404,
      message: "Endorsement not found",
    };
  }

  // If brand & product updated
  if (payload.brandName) {
    let brand = await Brand.findOne({ where: { name: payload.brandName } });
    if (!brand) brand = await Brand.create({ name: payload.brandName });
    payload.brand_id = brand.id;
  }

  if (payload.productName) {
    let product = await Product.findOne({
      where: { name: payload.productName, brand_id: payload.brand_id },
    });
    if (!product)
      product = await Product.create({
        name: payload.productName,
        brand_id: payload.brand_id,
      });
    payload.product_id = product.id;
  }

  await endorsement.update(payload);

  return {
    success: true,
    statusCode: 200,
    message: "Endorsement updated successfully",
    data: endorsement,
  };
};

// ✅ Delete Endorsement Service
export const deleteEndorsementService = async (id: number) => {
  const endorsement = await Endorsement.findByPk(id);

  if (!endorsement) {
    return {
      success: false,
      statusCode: 404,
      message: "Endorsement not found",
    };
  }

  await endorsement.destroy();

  return {
    success: true,
    statusCode: 200,
    message: "Endorsement deleted successfully",
  };
};