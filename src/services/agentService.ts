import { Worksheet } from "exceljs";

import ColdStorage from "../database/models/coldStorage";
import Farmer from "../database/models/farmer";
import { convertISTDateRangeToUTC, formatDate } from "../utils/dateFormat";

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
import AgentMonthlyTarget from "../database/models/agentMonthlyTarget";

export const retrieveAllUsers = async (
  agentId: string,
  page = 1,
  limit = 10,
  filters
) => {
  try {
    const offset = (page - 1) * limit;

    const { type, name, village, district, state, registrationDate } = filters;

    const whereCondition: any = { agentId, isDeleted: false };

    if (type && type !== "all") whereCondition.userType = type;
    if (name) whereCondition.userName = { [Op.iLike]: `%${name}%` };
    if (village) whereCondition.village = { [Op.iLike]: `%${village}%` };
    if (district) whereCondition.district = { [Op.iLike]: `%${district}%` };
    if (state) whereCondition.state = { [Op.iLike]: `%${state}%` };

    if (registrationDate && registrationDate.length === 2) {
      const [startDate, endDate] = registrationDate;

      if (startDate && endDate) {
        const { startUTC, endUTC } = convertISTDateRangeToUTC(
          startDate,
          endDate
        );
        whereCondition.createdAt = {
          [Op.between]: [new Date(startUTC), new Date(endUTC)],
        };
      }
    }

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

        return {
          id: profile.id,
          name: entry.userName,
          village: entry.village,
          district: entry.district,
          state: entry.state,
          createdAt: entry.createdAt,
          date: formatDate(entry.createdAt),
          canAgentEdit:
            Date.now() - new Date(entry.createdAt).getTime() <=
            24 * 60 * 60 * 1000,
          type: entry.userType,
          status: entry.statusOfRegistration,
        };
      })
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

export const retrieveRecentRegistered = async (
  agentId,
  page = 1,
  limit = 10
) => {
  try {
    const offset = (page - 1) * limit;

    const endOfWeek = dayjs().endOf("day").toDate();
    const startOfWeek = dayjs().subtract(6, "day").startOf("day").toDate();

    const { count, rows } = await AgentOnboardedUser.findAndCountAll({
      where: {
        agentId,
        isDeleted: false,
        createdAt: {
          [Op.between]: [startOfWeek, endOfWeek],
        },
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const enrichedResults = await Promise.all(
      rows.map(async (entry) => {
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

        return {
          id: profile.id,
          name: entry.userName,
          village: entry.village,
          district: entry.district,
          state: entry.state,
          createdAt: entry.createdAt,
          date: formatDate(entry.createdAt),
          canAgentEdit:
            Date.now() - new Date(entry.createdAt).getTime() <=
            24 * 60 * 60 * 1000,
          type: entry.userType,
          status: entry.statusOfRegistration,
        };
      })
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

export const retrieveAgentPerformance = async (
  agentId,
  year = dayjs().year()
) => {
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

    const allMonthsTarget = await AgentMonthlyTarget.findAll({
      where: { agentUserId: agentId, year },
    });

    const targetMap: Record<string, number> = {};

    allMonthsTarget.forEach((target) => {
      const label = dayjs(`${year}-${target.month}`, "YYYY-MMM").format("MMM");
      targetMap[label] = target.monthlyTarget;
    });

    const monthlyPerformance = monthList.map((fullMonthLabel) => {
      const shortMonth = dayjs(fullMonthLabel, "YYYY-MMM").format("MMM");

      const total =
        (farmerMap[fullMonthLabel] || 0) +
        (coldStorageMap[fullMonthLabel] || 0) +
        (traderMap[fullMonthLabel] || 0);

      const monthlyTarget = targetMap[shortMonth] || 0;

      return {
        month: shortMonth,
        monthlyRegistrations: total,
        monthlyTarget,
        completionOfMonthlyTargetPercentage:
          monthlyTarget === 0 ? 0 : (total / monthlyTarget) * 100,
      };
    });

    return {
      year,
      monthlyPerformance,
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
        where: { onBoardedBy: agentId, isDeleted: false },
      }),
      ColdStorage.count({
        where: { onBoardedBy: agentId, isDeleted: false },
      }),
      Trader.count({
        where: { onBoardedBy: agentId, isDeleted: false },
      }),
      Farmer.count({
        where: {
          onBoardedBy: agentId,
          createdAt: {
            [Op.between]: [startOfWeek, endOfWeek],
          },
          isDeleted: false,
        },
      }),
      ColdStorage.count({
        where: {
          onBoardedBy: agentId,
          createdAt: {
            [Op.between]: [startOfWeek, endOfWeek],
          },
          isDeleted: false,
        },
      }),
      Trader.count({
        where: {
          onBoardedBy: agentId,
          createdAt: {
            [Op.between]: [startOfWeek, endOfWeek],
          },
          isDeleted: false,
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
    order: [["updatedAt", "DESC"]],
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

  let hasUserChanged = false;

  // Update user fields
  if (agent.user) {
    if (name !== undefined) {
      agent.user.name = name;
      hasUserChanged = true;
    }
    if (email !== undefined) {
      agent.user.email = email;
      hasUserChanged = true;
    }
    if (phone !== undefined) {
      agent.user.mobile = phone;
      hasUserChanged = true;
    }

    await agent.user.save();
  }

  // Update agent fields
  if (phone !== undefined) agent.phone = phone;
  if (address !== undefined) agent.address = address;
  if (state !== undefined) agent.state = state;
  if (district !== undefined) agent.district = district;
  if (note !== undefined) agent.note = note;
  if (isActive != undefined) agent.isActive = isActive;

  if (hasUserChanged) agent.changed("updatedAt", true);

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

export const retrieveAllAgentPerformance = async (
  year = dayjs().year(),
  agentId
) => {
  const monthsBack = 12;

  const fromDate = dayjs(`${year}-01-01`).startOf("month");
  const toDate = dayjs(`${year}-12-31`).endOf("month");

  const [farmerMap, coldStorageMap, traderMap] = await Promise.all([
    getMonthWiseRegistrations(Farmer, fromDate.toDate(), toDate.toDate(), {
      onBoardedBy: agentId,
    }),
    getMonthWiseRegistrations(ColdStorage, fromDate.toDate(), toDate.toDate(), {
      onBoardedBy: agentId,
    }),
    getMonthWiseRegistrations(Trader, fromDate.toDate(), toDate.toDate(), {
      onBoardedBy: agentId,
    }),
  ]);

  const monthList = [];

  for (let i = 0; i < monthsBack; i++) {
    const month = fromDate.add(i, "month");
    monthList.push(month.format("YYYY-MMM"));
  }

  const allMonthsTarget = await AgentMonthlyTarget.findAll({
    where: { agentUserId: agentId, year },
  });

  const targetMap: Record<string, number> = {};

  allMonthsTarget.forEach((target) => {
    const label = dayjs(`${year}-${target.month}`, "YYYY-MMM").format("MMM");
    targetMap[label] = target.monthlyTarget;
  });

  const monthlyPerformance = monthList.map((fullMonthLabel) => {
    const shortMonth = dayjs(fullMonthLabel, "YYYY-MMM").format("MMM");

    const total =
      (farmerMap[fullMonthLabel] || 0) +
      (coldStorageMap[fullMonthLabel] || 0) +
      (traderMap[fullMonthLabel] || 0);

    const monthlyTarget = targetMap[shortMonth] || 0;

    return {
      month: shortMonth,
      monthlyRegistrations: total,
      monthlyTarget,
      completionOfMonthlyTargetPercentage:
        monthlyTarget === 0 ? 0 : (total / monthlyTarget) * 100,
    };
  });

  return {
    year,
    monthlyPerformance,
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

export const retrieveAllTicketDetails = async (
  page = 1,
  limit = 10,
  search
) => {
  const offset = (page - 1) * limit;

  const whereCondition = search
    ? {
        [Op.or]: [
          { ticketId: { [Op.iLike]: `%${search}%` } },
          { subject: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  const { count, rows } = await HelpAndSupport.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
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

  return {
    data: rows,
    paginationData: {
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    },
  };
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

export const retrieveAgentTickets = async (
  agentId,
  page = 1,
  limit = 10,
  search
) => {
  const offset = (page - 1) * limit;

  const whereCondition = {
    agentId,
    ...(search?.trim() && {
      [Op.or]: [
        { ticketId: { [Op.iLike]: `%${search.trim()}%` } },
        { subject: { [Op.iLike]: `%${search.trim()}%` } },
      ],
    }),
  };

  const { count, rows } = await HelpAndSupport.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
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
  return {
    data: rows,
    paginationData: {
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    },
  };
};

export const getAllAgentsWithAssociations = async (search?: string) => {
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

  const agents = await Agent.findAll({
    where: {
      isDeleted: false,
      ...searchCondition,
    },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });

  return agents;
};

export const createAgentWorksheetColumns = (worksheet: Worksheet) => {
  worksheet.columns = [
    { header: "ID", key: "id", width: 20 },
    { header: "Agent ID", key: "agentId", width: 20 },
    { header: "Name", key: "name", width: 25 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Email", key: "email", width: 40 },
    { header: "Status", key: "status", width: 20 },
    { header: "State", key: "state", width: 25 },
    { header: "District", key: "district", width: 25 },
    { header: "Address", key: "address", width: 60 },
    { header: "Joined Date", key: "createdAt", width: 20 },
  ];
};

export const addAgentsToWorksheet = (agents: any[], worksheet: Worksheet) => {
  agents.forEach((agent) => {
    worksheet.addRow({
      id: agent.id,
      agentId: agent.agentId,
      name: agent.user?.name || "",
      phone: agent.phone || "",
      email: agent.user?.email || "",
      status: agent.isActive ? "Active" : "Inactive",
      state: agent.state || "",
      district: agent.district || "",
      address: agent.address || "",
      createdAt: formatDate(agent.createdAt),
    });
  });
};
