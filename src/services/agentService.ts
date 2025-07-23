import ColdStorage from "../database/models/coldStorage";
import Farmer from "../database/models/farmer";
import { formatDate } from "../utils/dateFormat";

import { Op } from "sequelize";
import dayjs from "dayjs";
import Agent from "../database/models/agent";
import User from "../database/models/user";
import { generateRandomPassword } from "../utils/generate";
import { getMonthWiseRegistrations } from "../utils/getMonthWiseRegistration";
import Trader from "../database/models/trader/trader";
import HelpAndSupport, {
  PriorityEnum,
  StatusEnum,
} from "../database/models/helpAndSupport";
import sequelize from "../database/models/db";
import AgentOnboardedUser, {
  USER_TYPE,
} from "../database/models/agentOnboardedUsers";

export const retrieveAllUsers = async (
  agentId: string,
  page = 1,
  limit = 10,
  filters
) => {
  try {
    const offset = (page - 1) * limit;

    const { type, name, village, district, state } = filters;

    const whereCondition: any = { agentId };

    if (type) whereCondition.userType = type;
    if (name) whereCondition.userName = { [Op.iLike]: `%${name}%` };
    if (village) whereCondition.village = { [Op.iLike]: `%${village}%` };
    if (district) whereCondition.district = { [Op.iLike]: `%${district}%` };
    if (state) whereCondition.state = { [Op.iLike]: `%${state}%` };

    const { count, rows: onboarded } = await AgentOnboardedUser.findAndCountAll(
      {
        where: whereCondition,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      }
    );

    const enrichedResults = await Promise.all(
      onboarded.map(async (entry) => {
        let profile = null;

        if (entry.userType === USER_TYPE.FARMER) {
          profile = await Farmer.findOne({ where: { userId: entry.userId } });
        } else if (entry.userType === USER_TYPE.COLD_STORAGE) {
          profile = await ColdStorage.findOne({
            where: { userId: entry.userId },
          });
        } else if (entry.userType === USER_TYPE.TRADER) {
          profile = await Trader.findOne({ where: { userId: entry.userId } });
        }

        if (!profile) return null;

        return {
          id: profile.id,
          name: entry.userName,
          village: entry.village,
          district: entry.district,
          state: entry.state,
          createdAt: profile.createdAt,
          date: formatDate(profile.createdAt),
          canAgentEdit:
            Date.now() - new Date(profile.createdAt).getTime() <=
            24 * 60 * 60 * 1000,
          type: entry.userType,
          status: entry.statusOfRegistration,
        };
      })
    );

    enrichedResults.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      data: enrichedResults,
      currentPage: page,
      total: count,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const retrieveRecentRegistered = async (agentId) => {
  try {
    const [farmers, coldStorages, traders] = await Promise.all([
      Farmer.findAll({
        where: { onBoardedBy: agentId },
        order: [["createdAt", "DESC"]],
      }),
      ColdStorage.findAll({
        where: { onBoardedBy: agentId },
        order: [["createdAt", "DESC"]],
      }),
      Trader.findAll({
        where: { onBoardedBy: agentId },
        order: [["createdAt", "DESC"]],
      }),
    ]);

    const combined = [...farmers, ...coldStorages, ...traders].map(
      (item: any) => ({
        id: item.id,
        name: item instanceof Trader ? item.fullName : item.name,
        village: item instanceof Trader ? item.cityOrVillage : item.village,
        district: item.district,
        date: formatDate(item.createdAt),
        createdAt: item.createdAt,
        canAgentEdit:
          Date.now() - new Date(item.createdAt).getTime() <=
          24 * 60 * 60 * 1000,
        type:
          item instanceof Farmer
            ? "farmer"
            : item instanceof ColdStorage
            ? "cold storage"
            : "trader",
        status: "complete",
      })
    );

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

export const retrieveAgentPerformance = async (agentId, year = "2025") => {
  try {
    const monthsBack = 12;

    const fromDate = dayjs(`${year}-01-01`).startOf("month");
    const toDate = dayjs(`${year}-12-31`).endOf("month");

    const [farmerMap, coldStorageMap, traderMap] = await Promise.all([
      getMonthWiseRegistrations(Farmer, fromDate.toDate(), toDate.toDate(), {
        onBoardedBy: agentId,
      }),
      getMonthWiseRegistrations(
        ColdStorage,
        fromDate.toDate(),
        toDate.toDate(),
        {
          onBoardedBy: agentId,
        }
      ),
      getMonthWiseRegistrations(Trader, fromDate.toDate(), toDate.toDate(), {
        onBoardedBy: agentId,
      }),
    ]);

    const monthList = [];
    for (let i = 0; i < monthsBack; i++) {
      const month = fromDate.add(i, "month");
      monthList.push(month.format("YYYY-MMM"));
    }

    const monthlyRegistrations = monthList.map((fullMonthLabel) => {
      const shortMonth = dayjs(fullMonthLabel, "YYYY-MMM").format("MMM");
      return {
        month: shortMonth,
        total:
          (farmerMap[fullMonthLabel] || 0) +
          (coldStorageMap[fullMonthLabel] || 0) +
          (traderMap[fullMonthLabel] || 0),
      };
    });

    let currentMonthRegistrations = 0;
    let completionOfMonthlyTargetPercentage = 0;

    const isCurrentYear = dayjs().year() === parseInt(year);

    if (isCurrentYear) {
      const startOfMonth = dayjs().startOf("month").toDate();
      const endOfMonth = dayjs().endOf("month").toDate();

      const [currentFarmerCount, currentColdStorageCount, currentTraderCount] =
        await Promise.all([
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
          Trader.count({
            where: {
              onBoardedBy: agentId,
              createdAt: { [Op.between]: [startOfMonth, endOfMonth] },
            },
          }),
        ]);

      currentMonthRegistrations =
        currentFarmerCount + currentColdStorageCount + currentTraderCount;

      completionOfMonthlyTargetPercentage =
        (currentMonthRegistrations / 50) * 100;
    }

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
    const endOfWeek = dayjs().endOf("day").toDate();
    const startOfWeek = dayjs().subtract(6, "day").startOf("day").toDate();

    const agent = await Agent.findOne({ where: { userId: agentId } });
    if (!agent) {
      throw new Error("Agent not found");
    }

    const [
      farmerCount,
      coldStorageCount,
      traderCount,
      weeklyNewFarmers,
      weeklyNewColdStorages,
      weeklyNewTraders,
    ] = await Promise.all([
      Farmer.count({
        where: { onBoardedBy: agentId },
      }),
      ColdStorage.count({
        where: { onBoardedBy: agentId },
      }),
      Trader.count({
        where: { onBoardedBy: agentId },
      }),
      Farmer.count({
        where: {
          onBoardedBy: agentId,
          updatedAt: {
            [Op.between]: [startOfWeek, endOfWeek],
          },
        },
      }),
      ColdStorage.count({
        where: {
          onBoardedBy: agentId,
          updatedAt: {
            [Op.between]: [startOfWeek, endOfWeek],
          },
        },
      }),
      Trader.count({
        where: {
          onBoardedBy: agentId,
          updatedAt: {
            [Op.between]: [startOfWeek, endOfWeek],
          },
        },
      }),
    ]);

    return {
      agentId: agent.agentId,
      countOfFarmers: farmerCount,
      countOfColdStorage: coldStorageCount,
      countOfTraders: traderCount,
      weeklyNewFarmers,
      weeklyNewColdStorages,
      weeklyNewTraders,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPaginatedAgents = async (
  page: number,
  limit: number,
  search
) => {
  const offset = (page - 1) * limit;

  const searchCondition = search
    ? {
        [Op.or]: [
          { agentId: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } },
          { district: { [Op.iLike]: `%${search}%` } },
          { "$user.name$": { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  const { rows: agents, count: total } = await Agent.findAndCountAll({
    where: {
      isDeleted: false,
      ...searchCondition,
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

  const { name, email, phone, address, state, district, note, isActive } =
    updateData;

  // Check for duplicate email
  if (email && email !== agent.user?.email) {
    const existingEmail = await User.findOne({
      where: {
        email,
        id: { [Op.ne]: agent.user.id },
      },
    });

    if (existingEmail) {
      return {
        success: false,
        status: 409,
        message: "Email is already in use by another user",
      };
    }
  }

  // Check for duplicate phone (mobile)
  if (phone && phone !== agent.user?.mobile) {
    const existingPhone = await User.findOne({
      where: {
        mobile: phone,
        id: { [Op.ne]: agent.user.id },
      },
    });

    if (existingPhone) {
      return {
        success: false,
        status: 409,
        message: "Phone number is already in use by another user",
      };
    }
  }

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
  if (state !== undefined) agent.state = state;
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

export const retrieveAllAgentPerformance = async (year = "2025") => {
  const monthsBack = 12;
  const fromDate = dayjs(`${year}-01-01`).startOf("month");
  const toDate = dayjs(`${year}-12-31`).endOf("month");

  const [farmerMap, coldStorageMap, traderMap] = await Promise.all([
    getMonthWiseRegistrations(Farmer, fromDate.toDate(), toDate.toDate()),
    getMonthWiseRegistrations(ColdStorage, fromDate.toDate(), toDate.toDate()),
    getMonthWiseRegistrations(Trader, fromDate.toDate(), toDate.toDate()),
  ]);

  const monthList = [];
  for (let i = 0; i < monthsBack; i++) {
    const month = fromDate.add(i, "month");
    monthList.push(month.format("YYYY-MMM"));
  }

  const monthlyRegistrations = monthList.map((fullMonthLabel) => {
    const shortMonth = dayjs(fullMonthLabel, "YYYY-MMM").format("MMM");
    return {
      month: shortMonth,
      total:
        (farmerMap[fullMonthLabel] || 0) +
        (coldStorageMap[fullMonthLabel] || 0) +
        (traderMap[fullMonthLabel] || 0),
    };
  });

  const [farmerCount, coldStorageCount, traderCount] = await Promise.all([
    Farmer.count({}),
    ColdStorage.count({}),
    Trader.count({}),
  ]);

  const totalRegistrations = farmerCount + coldStorageCount + traderCount;
  const farmerPercentage = (farmerCount / totalRegistrations) * 100;
  const coldStoragePercentage = (coldStorageCount / totalRegistrations) * 100;
  const traderPercentage = (traderCount / totalRegistrations) * 100;

  return {
    monthlyRegistrations,
    farmerPercentage,
    coldStoragePercentage,
    traderPercentage,
  };
};

export const retrieveTopAgents = async () => {
  const agents = await Agent.findAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["name", "id"],
      },
    ],
    raw: true,
    nest: true,
  });

  const result = await Promise.all(
    agents.map(async (agent) => {
      const agentId = agent.user.id;

      const [farmerCount, coldStorageCount, traderCount] = await Promise.all([
        Farmer.count({ where: { onBoardedBy: agentId } }),
        ColdStorage.count({ where: { onBoardedBy: agentId } }),
        Trader.count({ where: { onBoardedBy: agentId } }),
      ]);

      const totalSubmissions = farmerCount + coldStorageCount + traderCount;

      return {
        agentId,
        agentName: `${agent.user.name}`,
        totalSubmissions,
      };
    })
  );

  const topAgents = result
    .sort((a, b) => b.totalSubmissions - a.totalSubmissions)
    .slice(0, 5);

  return topAgents;
};

export const createTicket = async (data, agentId) => {
  const { subject, description, priority } = data;

  if (!Object.values(PriorityEnum).includes(priority)) {
    return {
      success: false,
      error: `Invalid priority value. Allowed values are: ${Object.values(
        PriorityEnum
      ).join(", ")}`,
    };
  }

  const newTicket = await HelpAndSupport.create({
    subject,
    description,
    priority,
    agentId,
  });

  const ticketId = "TICKET-" + (1000 + newTicket.id);
  await newTicket.update({ ticketId });

  return {
    success: true,
    data: newTicket,
  };
};

export const responseOnTicket = async (ticketId, reply) => {
  const [updatedCount] = await HelpAndSupport.update(
    { reply, status: StatusEnum.IN_PROGRESS },
    { where: { ticketId } }
  );

  if (updatedCount === 0) {
    return {
      success: false,
      error: "No ticket found with the provided ticketId.",
    };
  }

  return { success: true };
};

export const retrieveTicketDetail = async (ticketId, agentId) => {
  const ticketDetail = await HelpAndSupport.findOne({
    where: { ticketId, agentId },
  });

  return ticketDetail;
};

export const retrieveAllTicketDetails = async () => {
  const allTicketDetails = await HelpAndSupport.findAll({
    order: [
      [
        sequelize.literal(`
            CASE 
              WHEN priority = 'high' THEN 1
              WHEN priority = 'medium' THEN 2
              WHEN priority = 'low' THEN 3
            END
          `),
        "ASC",
      ],
      ["createdAt", "DESC"],
    ],
  });

  return allTicketDetails;
};

export const changeTicketStatus = async (ticketId, status) => {
  if (!Object.values(StatusEnum).includes(status as StatusEnum)) {
    return {
      success: false,
      error: `Invalid status. Allowed values: ${Object.values(StatusEnum).join(
        ", "
      )}`,
    };
  }

  const ticket = await HelpAndSupport.findOne({ where: { ticketId } });

  if (!ticket) {
    return {
      success: false,
      error: "Ticket not found.",
    };
  }

  await ticket.update({ status });

  return {
    success: true,
  };
};

export const retrieveAgentTickets = async (agentId) => {
  const tickets = await HelpAndSupport.findAll({
    where: { agentId },
    order: [
      [
        sequelize.literal(`
            CASE 
              WHEN priority = 'high' THEN 1
              WHEN priority = 'medium' THEN 2
              WHEN priority = 'low' THEN 3
            END
          `),
        "ASC",
      ],
      ["createdAt", "DESC"],
    ],
  });
  return tickets;
};
