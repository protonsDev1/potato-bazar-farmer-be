import ColdStorage from "../database/models/coldStorage";
import Farmer from "../database/models/farmer";
import { formatDate } from "../utils/dateFormat";

import { Op, fn, col, literal } from "sequelize";
import dayjs from "dayjs";
import Agent from "../database/models/agent";

export const retriveAllUsers = async (
  agentId: string,
  page = 1,
  limit = 10
) => {
  try {
    const offset = (page - 1) * limit;

    const [farmers, coldStorages] = await Promise.all([
      Farmer.findAll({
        where: { onBoardedBy: agentId },
        order: [["createdAt", "DESC"]],
      }),
      ColdStorage.findAll({
        where: { onBoardedBy: agentId },
        order: [["createdAt", "DESC"]],
      }),
    ]);

    const combined = [...farmers, ...coldStorages].map((item: any) => ({
      id: item.id,
      name: item.name,
      village: item.village,
      district: item.district,
      createdAt: item.createdAt,
      date: formatDate(item.createdAt),
      type: item instanceof Farmer ? "farmer" : "cold storage",
      status: "complete",
    }));

    // Sort by date descending
    combined.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const paginated = combined.slice(offset, offset + limit);

    const result = paginated.map(({ createdAt, ...rest }) => rest);

    return {
      data: result,
      total: combined.length,
      currentPage: page,
      totalPages: Math.ceil(combined.length / limit),
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const retrieveRecentRegistered = async (agentId) => {
  try {
    const [farmers, coldStorages] = await Promise.all([
      Farmer.findAll({
        where: { onBoardedBy: agentId },
        order: [["createdAt", "DESC"]],
      }),
      ColdStorage.findAll({
        where: { onBoardedBy: agentId },
        order: [["createdAt", "DESC"]],
      }),
    ]);

    const combined = [...farmers, ...coldStorages].map((item: any) => ({
      id: item.id,
      name: item.name,
      village: item.village,
      district: item.district,
      date: formatDate(item.createdAt),
      createdAt: item.createdAt,
      type: item instanceof Farmer ? "farmer" : "cold storage",
      status: "complete",
    }));

    combined.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Take top 5
    const topFive = combined.slice(0, 5);

    const result = topFive.map(({ createdAt, ...rest }) => rest);

    return { data: result };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const retrieveAgentPerformance = async (agentId) => {
  try {
    const monthsBack = 12;
    const fromDate = dayjs()
      .subtract(monthsBack, "month")
      .startOf("month")
      .toDate();

    const farmerData: any = await Farmer.findAll({
      attributes: [
        [fn("TO_CHAR", col("createdAt"), "Mon"), "month"],
        [fn("COUNT", "*"), "count"],
      ],
      where: {
        createdAt: { [Op.gte]: fromDate },
        onBoardedBy: agentId,
      },
      group: [fn("TO_CHAR", col("createdAt"), "Mon")],
      raw: true,
    });

    const coldStorageData: any = await ColdStorage.findAll({
      attributes: [
        [fn("TO_CHAR", col("createdAt"), "Mon"), "month"],
        [fn("COUNT", "*"), "count"],
      ],
      where: {
        createdAt: { [Op.gte]: fromDate },
        onBoardedBy: agentId,
      },
      group: [fn("TO_CHAR", col("createdAt"), "Mon")],
      raw: true,
    });

    const dataMap: any = {};

    farmerData.forEach((row) => {
      if (!dataMap[row.month]) dataMap[row.month] = 0;
      dataMap[row.month] += parseInt(row.count);
    });

    coldStorageData.forEach((row) => {
      if (!dataMap[row.month]) dataMap[row.month] = 0;
      dataMap[row.month] += parseInt(row.count);
    });

    const monthlyRegistrations = Object.entries(dataMap)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const startOfMonth = dayjs().startOf("month").toDate();
    const endOfMonth = dayjs().endOf("month").toDate();

    const [currentFarmerCount, currentColdStorageCount] = await Promise.all([
      Farmer.count({
        where: {
          onBoardedBy: agentId,
          createdAt: { [Op.between]: [startOfMonth, endOfMonth] },
        },
      }),
      ColdStorage.count({
        where: {
          onBoardedBy: agentId,
          createdAt: { [Op.between]: [startOfMonth, endOfMonth] },
        },
      }),
    ]);

    const currentMonthRegistrations =
      currentFarmerCount + currentColdStorageCount;

    const completionOfMonthlyTargetPercentage =
      (currentMonthRegistrations / 50) * 100;

    return {
      monthlyRegistrations,
      currentMonthRegistrations,
      monthlyTarget: 50,
      completionOfMonthlyTargetPercentage,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const retrieveAgentDashboardStats = async (agentId) => {
  try {
    const startOfWeek = dayjs().startOf("week").toDate();
    const endOfWeek = dayjs().endOf("week").toDate();

    const agent = await Agent.findOne({ where: { userId: agentId } });
    if (!agent) {
      throw new Error("Agent not found");
    }

    const [
      farmerCount,
      coldStorageCount,
      weeklyNewFarmers,
      weeklyNewColdStorages,
    ] = await Promise.all([
      Farmer.count({
        where: { onBoardedBy: agentId },
      }),
      ColdStorage.count({
        where: { onBoardedBy: agentId },
      }),
      Farmer.count({
        where: {
          onBoardedBy: agentId,
          createdAt: {
            [Op.between]: [startOfWeek, endOfWeek],
          },
        },
      }),
      ColdStorage.count({
        where: {
          onBoardedBy: agentId,
          createdAt: {
            [Op.between]: [startOfWeek, endOfWeek],
          },
        },
      }),
    ]);

    return {
      agentId: agent.agentId,
      countOfFarmers: farmerCount,
      countOfColdStorage: coldStorageCount,
      weeklyNewFarmers,
      weeklyNewColdStorages,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
