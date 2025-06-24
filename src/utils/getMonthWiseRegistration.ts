import { fn, col, Op, WhereOptions } from "sequelize";

export const getMonthWiseRegistrations = async (
  model: any,
  fromDate: Date,
  where: WhereOptions = {}
): Promise<Record<string, number>> => {
  const data: any[] = await model.findAll({
    attributes: [
      [fn("TO_CHAR", col("createdAt"), "Mon"), "month"],
      [fn("COUNT", "*"), "count"],
    ],
    where: {
      createdAt: { [Op.gte]: fromDate },
      ...where,
    },
    group: [fn("TO_CHAR", col("createdAt"), "Mon")],
    raw: true,
  });

  const monthMap: Record<string, number> = {};
  data.forEach((row) => {
    if (!monthMap[row.month]) monthMap[row.month] = 0;
    monthMap[row.month] += parseInt(row.count);
  });

  return monthMap;
};
