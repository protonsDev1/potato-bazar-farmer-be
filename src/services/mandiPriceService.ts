import { Op, fn, col, where } from "sequelize";
import sequelize from "../database/models/db";
import MandiGradePrice from "../database/models/mandiGradePrice";
import MandiPrice from "../database/models/mandiPrice";
import City from "../database/models/city";
import MandiList from "../database/models/mandiList";
import MandiAllotedToMandiAgent from "../database/models/mandiAllotedToMandiAgent";
import MandiAgent from "../database/models/mandiAgent";

interface MandiPriceResponse {
  success: boolean;
  error?: string;
  data?: object;
  message?: string;
}

export const addMandiPriceService = async (
  data,
  userId
): Promise<MandiPriceResponse> => {
  const {
    mandiId,
    date,
    variety,
    category,
    arrivalStatus,
    totalArrivalBags,
    normalMandiArrivalBags,
    gradeWisePricing,
  } = data;

  const isMandiPriceDataExist = await MandiPrice.findOne({
    where: {
      mandiId,
      variety,
      category,
      [Op.and]: [where(fn("DATE", col("date")), date)],
    },
  });
  if (isMandiPriceDataExist) {
    return {
      success: false,
      error:
        "Mandi Price record already exists with the combination of city, mandi name, variety, category and date.",
    };
  }

  const mandiAgent = await MandiAgent.findOne({ where: { userId } });

  const isMandiAlloted = await MandiAllotedToMandiAgent.findOne({
    where: {
      mandiAgentId: mandiAgent.id,
      mandiId,
    },
  });

  if (!isMandiAlloted)
    return {
      success: false,
      error:
        "Mandi Agent do not have an access to add price for the given mandi.",
    };

  return await sequelize.transaction(async (t) => {
    const mandiPrice = await MandiPrice.create(
      {
        mandiId,
        date,
        variety,
        category,
        arrivalStatus,
        totalArrivalBags,
        normalMandiArrivalBags,
        createdByMandiAgentUserId: userId,
        lastUpdatedByMandiAgentUserId: userId,
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
  limit = 10,
  userId
) => {
  const offset = (page - 1) * limit;

  const whereCondition: any = {};

  const { category, variety, grade, date, arrival } = filters;

  const mandiAgent = await MandiAgent.findOne({ where: { userId } });

  const allotedMandis = await MandiAllotedToMandiAgent.findAll({
    where: { mandiAgentId: mandiAgent.id },
    attributes: ["mandiId"],
    raw: true,
  });

  const mandiIds = allotedMandis.map((m) => m.mandiId);

  if (mandiIds.length > 0) {
    whereCondition.mandiId = { [Op.in]: mandiIds };
  } else {
    return {
      data: [],
      currentPage: page,
      total: 0,
      totalPages: 0,
    };
  }

  if (variety) {
    whereCondition.variety = { [Op.eq]: variety };
  }

  if (category) {
    whereCondition.category = { [Op.eq]: category };
  }

  if (date) {
    whereCondition[Op.and] = [where(fn("DATE", col("date")), date)];
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

    orConditions.push({
      "$mandi.mandiName$": { [Op.iLike]: `%${search}%` },
    });

    whereCondition[Op.or] = orConditions;
  }

  const { count, rows } = await MandiPrice.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: MandiGradePrice,
        as: "grades",
      },
      {
        model: MandiList,
        as: "mandi",
        required: true,
        include: [
          {
            model: City,
            as: "city",
          },
        ],
      },
    ],
    limit,
    offset,
    distinct: true,
    order: [["createdAt", "DESC"]],
  });

  const data = rows.map((item) => ({
    id: item.id,
    mandiId: item.mandiId,
    mandiDetail: item?.mandi,
    date: item.date,
    variety: item.variety,
    category: item.category,
    arrivalStatus: item.arrivalStatus,
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

export const getAllMandiPricesByMandiId = async (filters, mandiId) => {
  const whereCondition: any = {};

  whereCondition.mandiId = mandiId;

  const today = new Date();
  const defaultDate = today.toISOString().split("T")[0];

  const { category, variety, date = defaultDate, arrival } = filters;

  if (variety) {
    whereCondition.variety = { [Op.eq]: variety };
  }

  if (category) {
    whereCondition.category = { [Op.eq]: category };
  }

  if (date) {
    whereCondition[Op.and] = [where(fn("DATE", col("date")), date)];
  }

  if (arrival) {
    whereCondition.arrivalStatus = { [Op.eq]: arrival };
  }

  const { count, rows } = await MandiPrice.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: MandiGradePrice,
        as: "grades",
      },
      {
        model: MandiList,
        as: "mandi",
        include: [
          {
            model: City,
            as: "city",
          },
        ],
      },
    ],
    distinct: true,
    order: [["createdAt", "DESC"]],
  });

  const mandiPrices = rows.map((item) => ({
    id: item.id,
    mandiId: item.mandiId,
    mandiDetail: item?.mandi,
    date: item.date,
    variety: item.variety,
    category: item.category,
    arrivalStatus: item.arrivalStatus,
    totalArrivalBags: item.totalArrivalBags,
    normalMandiArrivalBags: item.normalMandiArrivalBags,
    gradeWisePricing: item.grades,
  }));

  return {
    total: count,
    mandiPrices,
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

export const updateMandiPriceService = async (
  payload,
  mandiPriceId,
  userId
) => {
  const mandiPrice = await MandiPrice.findOne({ where: { id: mandiPriceId } });

  if (!mandiPrice)
    return {
      success: false,
      error: "Mandi Price Record not found.",
    };

  const mandiAgent = await MandiAgent.findOne({ where: { userId } });

  const isMandiAlloted = await MandiAllotedToMandiAgent.findOne({
    where: {
      mandiAgentId: mandiAgent.id,
      mandiId: payload.mandiId || mandiPrice.mandiId,
    },
  });

  if (!isMandiAlloted)
    return {
      success: false,
      error:
        "Mandi Agent do not have an access to add price for the given mandi.",
    };

  const isMandiPriceDataExist = await MandiPrice.findOne({
    where: {
      mandiId: payload.mandiId || mandiPrice.mandiId,
      variety: payload.variety || mandiPrice.variety,
      category: payload.category || mandiPrice.category,
      [Op.and]: [
        where(
          fn("DATE", col("date")),
          payload.date
            ? payload.date
            : mandiPrice.date.toISOString().split("T")[0]
        ),
        { id: { [Op.ne]: mandiPriceId } },
      ],
    },
  });

  if (isMandiPriceDataExist)
    return {
      success: false,
      error:
        "Mandi Price record already exist with the combination of city, mandi name, variety, category and date.",
    };

  const updateMandiPriceData: Record<string, any> = {};

  const updatableMandiPriceFields = [
    "mandiId",
    "date",
    "variety",
    "category",
    "arrivalStatus",
    "totalArrivalBags",
    "normalMandiArrivalBags",
  ];

  for (const field of updatableMandiPriceFields) {
    if (field in payload) {
      updateMandiPriceData[field] = payload[field];
    }
  }

  updateMandiPriceData["lastUpdatedByMandiAgentUserId"] = userId;

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

export const listCitiesWithMandis = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const total = await City.count({
    include: [
      {
        model: MandiList,
        as: "mandis",
        required: true,
        include: [
          {
            model: MandiPrice,
            as: "mandiPrices",
            required: true,
            attributes: [],
          },
        ],
      },
    ],
    distinct: true,
  });

  const citiesWithMandis = await City.findAll({
    include: [
      {
        model: MandiList,
        as: "mandis",
        required: true,
        include: [
          {
            model: MandiPrice,
            as: "mandiPrices",
            required: true,
            attributes: [],
          },
        ],
      },
    ],
    order: [["name", "ASC"]],
    limit,
    offset,
  });

  const cities = citiesWithMandis.map((city) => ({
    cityId: city.id,
    cityName: city.name,
    cityImage: city.image,
  }));

  return {
    cities,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getTopMandiPricesService = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await MandiPrice.findAndCountAll({
    include: [
      {
        model: MandiGradePrice,
        as: "grades",
      },
      {
        model: MandiList,
        as: "mandi",
        include: [
          {
            model: City,
            as: "city",
          },
        ],
      },
    ],
    distinct: true,
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  const mandiPrices = rows.map((item) => ({
    id: item.id,
    mandiId: item.mandiId,
    mandiDetail: item.mandi,
    date: item.date,
    variety: item.variety,
    category: item.category,
    arrivalStatus: item.arrivalStatus,
    totalArrivalBags: item.totalArrivalBags,
    normalMandiArrivalBags: item.normalMandiArrivalBags,
    gradeWisePricing: item.grades,
  }));

  return {
    total: count,
    mandiPrices,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  };
};
