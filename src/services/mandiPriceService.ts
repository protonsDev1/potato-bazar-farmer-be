import { Op } from "sequelize";
import sequelize from "../database/models/db";
import MandiGradePrice from "../database/models/mandiGradePrice";
import MandiPrice from "../database/models/mandiPrice";

interface MandiPriceResponse {
  success: boolean;
  error?: string;
  data?: object;
  message?: string;
}

export const addMandiPriceService = async (
  data
): Promise<MandiPriceResponse> => {
  const {
    mandiName,
    date,
    variety,
    category,
    arrivalStatus,
    state,
    city,
    totalArrivalBags,
    normalMandiArrivalBags,
    gradeWisePricing,
  } = data;

  const isMandiPriceDataExist = await MandiPrice.findOne({
    where: { city, variety, category },
  });

  if (isMandiPriceDataExist)
    return {
      success: false,
      error:
        "Mandi Price record already exist with combination of given city, variety and category.",
    };

  return await sequelize.transaction(async (t) => {
    const mandiPrice = await MandiPrice.create(
      {
        mandiName,
        date,
        variety,
        category,
        arrivalStatus,
        state,
        city,
        totalArrivalBags,
        normalMandiArrivalBags,
      },
      { transaction: t }
    );

    const mandiGradeWisePrice = await MandiGradePrice.bulkCreate(
      gradeWisePricing.map((grade) => ({
        mandiPriceId: mandiPrice.id,
        mandiGradeType: grade.mandiGradeType,
        gradeArrivalPercentage: grade.gradeArrivalPercentage,
        gradePricePerKg: grade.gradePricePerKg,
        quantityInBags: grade.quantityInBags,
      })),
      { transaction: t }
    );

    return {
      success: true,
      data: {
        mandiPrice,
        mandiGradeWisePrice,
      },
    };
  });
};

export const getAllMandiPricesService = async (
  search,
  filters,
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;

  const whereCondition: any = {};

  const { category, variety, grade, date, arrival } = filters;

  if (variety) {
    whereCondition.variety = { [Op.eq]: variety };
  }

  if (category) {
    whereCondition.category = { [Op.eq]: category };
  }

  if (date) {
    whereCondition.date = {
      [Op.eq]: new Date(date),
    };
  }

  if (grade) {
    const gradeMatches = await MandiGradePrice.findAll({
      where: { mandiGradeType: grade },
      attributes: ["mandiPriceId"],
      raw: true,
    });

    const mandiPriceIds = gradeMatches.map((g) => g.mandiPriceId);

    if (mandiPriceIds.length > 0) {
      whereCondition.id = { [Op.in]: mandiPriceIds };
    } else {
      whereCondition.id = null;
    }
  }

  if (arrival) {
    whereCondition.arrivalStatus = { [Op.eq]: arrival };
  }

  if (search) {
    const orConditions: any[] = [
      { variety: { [Op.iLike]: `%${search}%` } },
      { category: { [Op.iLike]: `%${search}%` } },
      { mandiName: { [Op.iLike]: `%${search}%` } },
    ];

    const gradeMatches = await MandiGradePrice.findAll({
      where: { mandiGradeType: { [Op.iLike]: `%${search}%` } },
      attributes: ["mandiPriceId"],
      raw: true,
    });

    const mandiPriceIds = gradeMatches.map((g) => g.mandiPriceId);

    if (mandiPriceIds.length > 0) {
      orConditions.push({ id: { [Op.in]: mandiPriceIds } });
    }

    whereCondition[Op.or] = orConditions;
  }

  const { count, rows } = await MandiPrice.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: MandiGradePrice,
        as: "grades",
      },
    ],
    limit,
    offset,
    distinct: true,
    order: [["createdAt", "DESC"]],
  });

  const data = rows.map((item) => ({
    id: item.id,
    mandiName: item.mandiName,
    date: item.date,
    variety: item.variety,
    category: item.category,
    arrivalStatus: item.arrivalStatus,
    state: item.state,
    city: item.city,
    totalArrivalBags: item.totalArrivalBags,
    normalMandiArrivalBags: item.normalMandiArrivalBags,
    gradeWisePricing: item.grades,
  }));

  return {
    data,
    currentPage: page,
    total: count,
    totalPages: Math.ceil(count / limit),
  };
};

export const getMandiPriceByIdService = async (mandiPriceId) => {
  const mandiPriceData = await MandiPrice.findByPk(mandiPriceId);

  const gradeWiseBreakDown = await MandiGradePrice.findAll({
    where: { mandiPriceId },
  });

  return {
    data: {
      mandiPriceData,
      gradeWiseBreakDown,
    },
  };
};

export const updateMandiPriceService = async (payload, mandiPriceId) => {
  const mandiPrice = await MandiPrice.findOne({ where: { id: mandiPriceId } });

  if (!mandiPrice)
    return {
      success: false,
      error: "Mandi Price Record not found.",
    };

  const isMandiPriceDataExist = await MandiPrice.findOne({
    where: {
      city: payload.city,
      variety: payload.variety,
      category: payload.category,
    },
  });

  if (isMandiPriceDataExist && isMandiPriceDataExist.id != mandiPriceId)
    return {
      success: false,
      error:
        "Mandi Price record already exist with combination of given city, variety and category.",
    };

  const updateMandiPriceData: Record<string, any> = {};

  const updatableMandiPriceFields = [
    "variety",
    "category",
    "arrivalStatus",
    "state",
    "city",
    "totalArrivalBags",
    "normalMandiArrivalBags",
  ];

  for (const field of updatableMandiPriceFields) {
    if (field in payload) {
      updateMandiPriceData[field] = payload[field];
    }
  }

  const result = await sequelize.transaction(async (t) => {
    let updatedMandiPriceRow = null;
    let updatedMandiGradePriceRows: any = [];

    if (Object.keys(updateMandiPriceData).length) {
      const [, updated] = await MandiPrice.update(updateMandiPriceData, {
        where: { id: mandiPriceId },
        transaction: t,
        returning: true,
      });
      updatedMandiPriceRow = updated[0] || null;
    }

    if (Array.isArray(payload.gradeWisePricing)) {
      await MandiGradePrice.destroy({
        where: { mandiPriceId },
        transaction: t,
      });

      updatedMandiGradePriceRows = await MandiGradePrice.bulkCreate(
        payload.gradeWisePricing.map((grade) => ({
          mandiPriceId: mandiPriceId,
          mandiGradeType: grade.mandiGradeType,
          gradeArrivalPercentage: grade.gradeArrivalPercentage,
          gradePricePerKg: grade.gradePricePerKg,
          quantityInBags: grade.quantityInBags,
        })),
        { transaction: t }
      );
    }

    return {
      mandiPrice: updatedMandiPriceRow || mandiPrice,
      gradeWisePricing: updatedMandiGradePriceRows,
    };
  });

  return {
    success: true,
    message: "Mandi Price record updated successfully.",
    data: result,
  };
};

export const retrieveDashboardStats = async () => {
  const curDate = new Date();
  const todayStart = new Date(curDate.setHours(0, 0, 0, 0));
  const todayEnd = new Date(curDate.setHours(23, 59, 59, 999));

  const [totalEntries, todaysEntries, totalVarieties] = await Promise.all([
    MandiPrice.count(),

    MandiPrice.count({
      where: {
        createdAt: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
    }),

    MandiPrice.count({
      distinct: true,
      col: "variety",
    }),
  ]);

  return {
    totalEntries,
    todaysEntries,
    totalVarieties,
  };
};
