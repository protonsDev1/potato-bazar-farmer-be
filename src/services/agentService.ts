import ColdStorage from "../database/models/coldStorage";
import Farmer from "../database/models/farmer";
import { formatDate } from "../utils/dateFormat";

import { Op, fn, col, literal } from "sequelize";
import dayjs from "dayjs";
import Agent from "../database/models/agent";
import User from "../database/models/user";
import { generateRandomPassword } from "../utils/generate";

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

export const getPaginatedAgents = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;

  const { rows: agents, count: total } = await Agent.findAndCountAll({
    where: {
      isDeleted: false,
    },
    attributes: { exclude: ["userId", "isDeleted"] },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    agents,
    pagination: {
      total,
      page,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateAgentById = async (agentId: number, updateData: any) => {
  const agent = await Agent.findOne({
    where: {
      id: agentId,
      isDeleted: false,
    },
    attributes: { exclude: ["userId", "isDeleted"] },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  if (!agent) {
    return { success: false, status: 404, message: "Agent not found" };
  }

  const { name, email, phone, address, district, note, isActive } = updateData;

  // Update user fields
  if (agent.user) {
    if (name !== undefined) agent.user.name = name;
    if (email !== undefined) agent.user.email = email;
    if (phone !== undefined) agent.user.mobile = phone;

    await agent.user.save();
  }

  // Update agent fields
  if (phone !== undefined) agent.phone = phone;
  if (address !== undefined) agent.address = address;
  if (district !== undefined) agent.district = district;
  if (note !== undefined) agent.note = note;
  if (isActive != undefined) agent.isActive = isActive;

  await agent.save();

  return { success: true, data: agent };
};

export const getAgentDetailsById = async (agentId: number) => {
  const agent = await Agent.findOne({
    where: {
      id: agentId,
      isDeleted: false,
    },
    attributes: { exclude: ["userId", "isDeleted"] },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  if (!agent) {
    return { success: false, status: 404, message: "Agent not found" };
  }

  return { success: true, data: agent };
};

export const softDeleteAgentById = async (agentId: number) => {
  const agent = await Agent.findByPk(agentId);

  if (!agent || agent.isDeleted) {
    return { success: false, status: 404, message: "Agent not found" };
  }

  agent.isDeleted = true;
  await agent.save();

  return { success: true, data: agent };
};

export const resetAgentPassword = async (agentId: number) => {
  const agent = await Agent.findOne({
    where: {
      id: agentId,
      isDeleted: false,
    },
    include: [
      {
        model: User,
        as: "user",
      },
    ],
  });

  if (!agent || !agent.user) {
    return { success: false, status: 404, message: "Agent not found" };
  }

  const newPassword = generateRandomPassword();

  agent.user.password = newPassword;
  await agent.user.save();

  return {
    success: true,
    password: newPassword,
    agentId: agent.agentId,
  };
};
