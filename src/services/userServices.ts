import User, {
  PB_VERIFICATION_STATUS,
  REGISTRATION_STATUS,
  USER_REGISTRATION_TYPES,
  USER_ROLES,
} from "../database/models/user";
import Agent from "../database/models/agent";
import { generateAgentId, generateRandomPassword } from "../utils/generate";
import Farmer from "../database/models/farmer";
import ColdStorage from "../database/models/coldStorage";
import { createOtp, verifyOtpFromDB } from "./otpServices";
import { col, fn, Op, Sequelize } from "sequelize";
import { formatDistanceToNow } from "date-fns";
import bcrypt from "bcrypt";
import Trader from "../database/models/trader/trader";
import { formatDate } from "../utils/dateFormat";
import AgentOnboardedUser, {
  USER_TYPE,
} from "../database/models/agentOnboardedUsers";
import KycDocument from "../database/models/kycDocuments";
import { hasValue } from "../utils/parseQuery";
import SubAdminWebPermission from "../database/models/subAdminWebPermission";
import { PERMISSIONS, WEB_ACTIONS } from "../utils/constants/permissions";
import BuyRequest, { BUY_REQUEST_STATUS } from "../database/models/buyRequest";
import MandiAgent from "../database/models/mandiAgent";
import SellRequest, {
  SELL_REQUEST_STATUS,
} from "../database/models/sellRequest";
import UserSupport from "../database/models/userSupport";
import SubAdminPermission from "../database/models/subAdminPermission";
import { retrieveFarmerProfile } from "./farmerServices";
import { retrieveTraderProfile } from "./traderService";
import Event from "../database/models/event";
import News, { NEWS_STATUS } from "../database/models/news";
import MandiList from "../database/models/mandiList";
import GovernmentScheme from "../database/models/govScheme";
import { sendNotificationService } from "./notificationService";
import { NotificationType } from "../database/models/notification";
import MandiPrice from "../database/models/mandiPrice";
import Directory from "../database/models/directory";
import DirectoryPlan from "../database/models/directoryPlan";
import Banner from "../database/models/banner";
import Advertisement from "../database/models/advertisement";
import ContactSupport from "../database/models/contactSupport";
import PromotionRequest from "../database/models/promotionRequest";
import AskExpert, { QUERY_STATUS } from "../database/models/askExpert";
import KnowledgeHub, {
  KNOWLEDGE_HUB_STATUS,
} from "../database/models/knowledgeHub";

export const createUserInDB = async (userModuleData: any) => {
  try {
    return await User.create(userModuleData);
  } catch (error) {
    throw error;
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    return await User.findOne({ where: { email } });
  } catch (error) {
    throw error;
  }
};

export const createUserWithAgent = async ({
  name,
  email,
  phone,
  address,
  state,
  district,
  note,
}: any) => {
  const whereCondition: any = {};
  if (email) {
    whereCondition[Op.or] = [...(whereCondition[Op.or] || []), { email }];
  }
  if (phone) {
    whereCondition[Op.or] = [
      ...(whereCondition[Op.or] || []),
      { mobile: phone },
    ];
  }

  const existingUser = await User.findOne({ where: whereCondition });

  if (existingUser) {
    if (email && existingUser.email && existingUser.email === email) {
      throw new Error("User with this email already exists");
    }
    if (phone && existingUser.mobile && existingUser.mobile === phone) {
      throw new Error("User with this phone number already exists");
    }
  }

  const password = generateRandomPassword();
  const agentId = generateAgentId();

  // Ensure uniqueness of agentId
  const existingAgent = await Agent.findOne({ where: { agentId } });
  if (existingAgent)
    throw new Error("Generated agent ID conflict. Please retry.");

  const user = await User.create({
    name,
    email,
    mobile: phone,
    password,
    role: "agent",
    location: address,
  });

  const agent = await Agent.create({
    userId: user.id,
    phone,
    address,
    state,
    district,
    note,
    agentId,
  });

  return {
    user,
    agent,
    sharedCredentials: {
      agentId,
      email: user.email,
      password,
    },
  };
};

export const findAgentWithUser = async (agentId: string) => {
  return await Agent.findOne({
    where: { agentId },
    include: [{ model: User, as: "user" }],
  });
};

const getDateRange = () => {
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);

  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);

  return { oneWeekAgo, oneMonthAgo };
};

export const getDashboardCounts = async () => {
  const { oneWeekAgo, oneMonthAgo } = getDateRange();

  const [totalAgents, agentsLastWeek, agentsLastMonth] = await Promise.all([
    Agent.count({
      // where: { isDeleted: false }
    }),
    Agent.count({
      where: {
        // isDeleted: false,
        createdAt: { [Op.gte]: oneWeekAgo },
      },
    }),
    Agent.count({
      where: {
        // isDeleted: false,
        createdAt: { [Op.gte]: oneMonthAgo },
      },
    }),
  ]);

  const [agentUsers, adminUsers] = await Promise.all([
    User.findAll({ where: { role: "agent" }, attributes: ["id"] }),
    User.findAll({ where: { role: "admin" }, attributes: ["id"] }),
  ]);
  const agentIds = agentUsers.map((u) => u.id);
  const adminIds = adminUsers.map((u) => u.id);

  const [
    totalFarmers,
    farmersLastWeek,
    farmersLastMonth,
    farmersByAgents,
    farmersSelfOnboarded,
    farmersByAdmins,
  ] = await Promise.all([
    Farmer.count(),
    Farmer.count({
      where: { createdAt: { [Op.gte]: oneWeekAgo } },
    }),
    Farmer.count({
      where: { createdAt: { [Op.gte]: oneMonthAgo } },
    }),
    Farmer.count({
      where: { onBoardedBy: { [Op.in]: agentIds } },
    }),
    Farmer.count({
      where: {
        [Op.and]: [
          { onBoardedBy: { [Op.not]: null } },
          Sequelize.where(
            Sequelize.col("onBoardedBy"),
            "=",
            Sequelize.col("userId")
          ),
        ],
      },
    }),
    Farmer.count({
      where: { onBoardedBy: { [Op.in]: adminIds } },
    }), // <-- NEW
  ]);

  const [
    totalColdStorages,
    coldStoragesLastWeek,
    coldStoragesLastMonth,
    coldStoragesByAgents,
    coldStoragesSelfOnboarded,
    coldStoragesByAdmins,
  ] = await Promise.all([
    ColdStorage.count(),
    ColdStorage.count({
      where: { createdAt: { [Op.gte]: oneWeekAgo } },
    }),
    ColdStorage.count({
      where: { createdAt: { [Op.gte]: oneMonthAgo } },
    }),
    ColdStorage.count({
      where: { onBoardedBy: { [Op.in]: agentIds } },
    }),
    ColdStorage.count({
      where: {
        [Op.and]: [
          { onBoardedBy: { [Op.not]: null } },
          Sequelize.where(
            Sequelize.col("onBoardedBy"),
            "=",
            Sequelize.col("userId")
          ),
        ],
      },
    }),
    ColdStorage.count({
      where: { onBoardedBy: { [Op.in]: adminIds } },
    }), // <-- NEW
  ]);

  const [
    totalTraders,
    tradersLastWeek,
    tradersLastMonth,
    tradersByAgents,
    tradersSelfOnboarded,
    tradersByAdmins,
  ] = await Promise.all([
    Trader.count(),
    Trader.count({
      where: { createdAt: { [Op.gte]: oneWeekAgo } },
    }),
    Trader.count({
      where: { createdAt: { [Op.gte]: oneMonthAgo } },
    }),
    Trader.count({
      where: { onBoardedBy: { [Op.in]: agentIds } },
    }),
    Trader.count({
      where: {
        [Op.and]: [
          { onBoardedBy: { [Op.not]: null } },
          Sequelize.where(
            Sequelize.col("onBoardedBy"),
            "=",
            Sequelize.col("userId")
          ),
        ],
      },
    }),
    Trader.count({
      where: { onBoardedBy: { [Op.in]: adminIds } },
    }), // <-- NEW
  ]);

  const calcPercent = (count: number, total: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0;

  const farmerAgentPercent = calcPercent(farmersByAgents, totalFarmers);
  const selfOnboardedFarmerPercent = calcPercent(
    farmersSelfOnboarded,
    totalFarmers
  );
  const farmerAdminPercent = calcPercent(farmersByAdmins, totalFarmers);

  const coldStorageAgentPercent = calcPercent(
    coldStoragesByAgents,
    totalColdStorages
  );
  const selfOnboardedColdStoragePercent = calcPercent(
    coldStoragesSelfOnboarded,
    totalColdStorages
  );
  const coldStorageAdminPercent = calcPercent(
    coldStoragesByAdmins,
    totalColdStorages
  );

  const traderAgentPercent = calcPercent(tradersByAgents, totalTraders);
  const selfOnboardedTraderPercent = calcPercent(
    tradersSelfOnboarded,
    totalTraders
  );
  const traderAdminPercent = calcPercent(tradersByAdmins, totalTraders);

  return {
    agents: {
      total: totalAgents,
      lastWeek: agentsLastWeek,
      lastMonth: agentsLastMonth,
    },
    farmers: {
      total: totalFarmers,
      lastWeek: farmersLastWeek,
      lastMonth: farmersLastMonth,
      byAgents: farmersByAgents,
      selfOnboarded: farmersSelfOnboarded,
      byAdmins: farmersByAdmins,
      onboardingRatio: {
        agentOnboarded: `${farmersByAgents} (${farmerAgentPercent}%)`,
        selfOnboarded: `${farmersSelfOnboarded} (${selfOnboardedFarmerPercent}%)`,
        adminOnboarded: `${farmersByAdmins} (${farmerAdminPercent}%)`,
      },
    },
    coldStorages: {
      total: totalColdStorages,
      lastWeek: coldStoragesLastWeek,
      lastMonth: coldStoragesLastMonth,
      byAgents: coldStoragesByAgents,
      selfOnboarded: coldStoragesSelfOnboarded,
      byAdmins: coldStoragesByAdmins,
      onboardingRatio: {
        agentOnboarded: `${coldStoragesByAgents} (${coldStorageAgentPercent}%)`,
        selfOnboarded: `${coldStoragesSelfOnboarded} (${selfOnboardedColdStoragePercent}%)`,
        adminOnboarded: `${coldStoragesByAdmins} (${coldStorageAdminPercent}%)`,
      },
    },
    traders: {
      total: totalTraders,
      lastWeek: tradersLastWeek,
      lastMonth: tradersLastMonth,
      byAgents: tradersByAgents,
      selfOnboarded: tradersSelfOnboarded,
      byAdmins: tradersByAdmins,
      onboardingRatio: {
        agentOnboarded: `${tradersByAgents} (${traderAgentPercent}%)`,
        selfOnboarded: `${tradersSelfOnboarded} (${selfOnboardedTraderPercent}%)`,
        adminOnboarded: `${tradersByAdmins} (${traderAdminPercent}%)`,
      },
    },
  };
};

export const checkExistingUser = async (mobile) => {
  return await User.findOne({
    where: { mobile },
    include: [{ model: KycDocument, as: "kycDocument" }],
  });
};

export const getRegistrationTypes = async (mobile) => {
  const user = await User.findOne({ where: { mobile } });

  if (!user) {
    return {
      isFarmerOnboarded: false,
      isColdStorageOnboarded: false,
      isTraderOnboarded: false,
    };
  }

  const [isFarmer, isColdStorage, isTrader, coldStorageList] =
    await Promise.all([
      Farmer.findOne({ where: { userId: user.id } }),
      ColdStorage.findOne({ where: { userId: user.id } }),
      Trader.findOne({ where: { userId: user.id } }),
      ColdStorage.findAll({
        where: { userId: user.id },
        attributes: [
          "id",
          "name",
          "firstName",
          "lastName",
          "ownerName",
          "mobileNumber",
          "state",
          "district",
          "totalCapacityMt",
          "createdAt",
          "updatedAt",
          "onBoardedBy",
          "status",
          "isAvailable",
        ],
      }),
    ]);

  return {
    isFarmerOnboarded: !!isFarmer,
    isColdStorageOnboarded: !!isColdStorage,
    isTraderOnboarded: !!isTrader,
    coldStorageList: coldStorageList,
  };
};

export const registerInitialUser = async (
  mobile,
  hasStartedUsingMobile,
  playerId
) => {
  return await User.create({
    name: "Guest",
    mobile,
    role: "user",
    otpVerified: true,
    hasStartedUsingMobile: !!hasStartedUsingMobile,
    playerId,
  });
};

export const updateRegistrationTypes = async (mobile, newTypes) => {
  const user = await User.findOne({ where: { mobile } });
  if (!user) return null;

  const currentTypes = user.registration_types || [];
  const updatedTypes = Array.from(new Set([...currentTypes, ...newTypes]));

  user.registration_types = updatedTypes;
  await user.save();

  return user;
};

export const updateUserInDB = async (userId: number, updateData: any) => {
  try {
    return await User.update(updateData, {
      where: { id: userId },
    });
  } catch (error) {
    throw error;
  }
};

export const getUserProfileDB = async (id) => {
  const user = await User.findOne({
    where: { id },
    include: [
      {
        model: Agent,
        as: "agentProfile",
        attributes: ["id", "phone", "address", "district", "note", "agentId"],
      },
    ],
    attributes: {
      exclude: ["password_hash"],
      include: ["lastLogin", "passwordUpdatedAt"],
    },
  });
  if (!user) return null;

  const result: any = user.toJSON();

  if (user.agentProfile) {
    const agentId = user.id;

    const [farmerCount, coldStorageCount, traderCount] = await Promise.all([
      Farmer.count({ where: { onBoardedBy: agentId } }),
      ColdStorage.count({ where: { onBoardedBy: agentId } }),
      Trader.count({ where: { onBoardedBy: agentId } }),
    ]);

    result.onboardingStats = {
      farmerCount,
      coldStorageCount,
      traderCount,
    };
  }
  return result;
};

export const forgotPasswordService = async (mobile: string, email: string) => {
  try {
    const orConditions = [];
    if (email) orConditions.push({ email });
    if (mobile) orConditions.push({ mobile });

    const userResponse = await User.findOne({
      where: { [Op.or]: orConditions },
    });

    if (!userResponse) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    await createOtp(mobile, email);

    await User.update(
      { otpVerified: false },
      { where: { [Op.or]: orConditions } }
    );

    return {
      success: true,
    };
  } catch (error) {
    throw new Error(`Error in forgot password : ${error.message}`);
  }
};

export const resetPasswordService = async (
  mobile: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  try {
    if (password !== confirmPassword)
      return {
        success: false,
        error: "Password and Confirm Password should be same.",
      };

    const orConditions = [];
    if (email) orConditions.push({ email });
    if (mobile) orConditions.push({ mobile });

    const userResponse = await User.findOne({
      where: { [Op.or]: orConditions },
    });

    if (!userResponse) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    if (!userResponse.otpVerified) {
      return {
        success: false,
        error: "Otp verification is required before resetting the password.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.update(
      { password_hash: hashedPassword, otpVerified: false },
      { where: { [Op.or]: orConditions } }
    );

    return {
      success: true,
    };
  } catch (error) {
    throw new Error("Error in resetting password.");
  }
};

export const findUserByPkInDB = async (id: number) => {
  try {
    const user = await User.findByPk(id);

    if (!user)
      return {
        success: false,
        error: "User not found.",
      };

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    throw new Error("Error in finding user by primary key in db.");
  }
};

export const changePasswordService = async (
  oldPassword,
  newPassword,
  confirmNewPassword,
  id
) => {
  try {
    const userData = await findUserByPkInDB(id);

    if (!userData.success) return { success: false, error: userData.error };

    const isMatch = await userData.data.validatePassword(oldPassword);

    if (!isMatch)
      return {
        success: false,
        error: "Old Password does not match.",
      };

    if (newPassword !== confirmNewPassword)
      return {
        success: false,
        error: "New Password and Confirm New Password should be same.",
      };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password_hash: hashedPassword }, { where: { id } });

    return {
      success: true,
    };
  } catch (error) {
    throw new Error(`Error in changing password: ${error.message}`);
  }
};

export const updateProfileService = async (data, userId, role) => {
  try {
    const { email, mobile, location } = data;

    if (email) {
      const user = await findUserByEmail(email);
      if (user && user.id !== userId)
        return {
          success: false,
          error: "Email already exist.",
        };
    }

    if (mobile) {
      if (role === USER_ROLES.ADMIN)
        return {
          success: false,
          error:
            "Admin is not allowed to update mobile number without verification.",
        };

      const user = await checkExistingUser(mobile);
      if (user && user.id !== userId)
        return { success: false, error: "Mobile number already exist." };
    }

    await User.update({ ...data }, { where: { id: userId } });

    // Update Agent
    if (role === USER_ROLES.AGENT) {
      const existingAgent = await Agent.findOne({ where: { userId } });
      if (existingAgent) {
        await Agent.update(
          {
            ...(mobile && { phone: mobile }),
            ...(location && { address: location }),
          },
          { where: { userId } }
        );
      }
    }

    return {
      success: true,
    };
  } catch (error) {
    throw new Error(`Error in updating profile: ${error.message}`);
  }
};

export const retrieveRecentRegisteredForAdmin = async () => {
  try {
    const [farmers, coldStorages, traders] = await Promise.all([
      Farmer.findAll({
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),
      ColdStorage.findAll({
        order: [["createdAt", "DESC"]],
        limit: 5,
      }),
      Trader.findAll({
        order: [["createdAt", "DESC"]],
        limit: 5,
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

const normalizeUserType = (userType: string): string | null => {
  const mapping: Record<string, string> = {
    farmer: "farmer",
    trader: "trader",
    cold_storage: "coldStorage",
  };

  return mapping[userType] || null;
};

export const updateRegistrationStatus = async (
  status: string,
  userType: string,
  entityId: number,
  currentUser: User,
  reason
) => {
  try {
    if (
      currentUser.role === USER_ROLES.ADMIN ||
      (currentUser.role === USER_ROLES.SUPER_ADMIN &&
        userType === USER_TYPE.COLD_STORAGE)
    ) {
    } else if (currentUser.role === USER_ROLES.SUB_ADMIN_WEB) {
      const normalizedUserType = normalizeUserType(userType);

      const hasReviewPermission = await SubAdminWebPermission.findOne({
        where: {
          userId: currentUser.id,
          module: normalizedUserType,
          action: WEB_ACTIONS.APPROVE_REJECT,
        },
      });

      if (!hasReviewPermission) {
        return {
          success: false,
          statusCode: 403,
          error: `Access denied: Missing approve/reject permission for ${normalizedUserType}`,
        };
      }
    } else if (
      currentUser.role === USER_ROLES.SUB_ADMIN &&
      userType === USER_TYPE.COLD_STORAGE
    ) {
      const hasPermission = await SubAdminPermission.findOne({
        where: { userId: currentUser.id, permission: PERMISSIONS.COLD_STORAGE },
      });

      if (!hasPermission) {
        return {
          success: false,
          statusCode: 403,
          error: `Access denied: Missing '${PERMISSIONS.COLD_STORAGE}' permission.`,
        };
      }
    } else {
      return {
        success: false,
        statusCode: 403,
        error: "Access denied: Unauthorized role",
      };
    }

    if (
      !Object.values(REGISTRATION_STATUS).includes(
        status as REGISTRATION_STATUS
      )
    ) {
      return {
        success: false,
        statusCode: 400,
        error: `Invalid status. Allowed values: ${Object.values(
          REGISTRATION_STATUS
        ).join(", ")}`,
      };
    }

    let Model;
    switch (userType) {
      case USER_TYPE.FARMER:
        Model = Farmer;
        break;
      case USER_TYPE.COLD_STORAGE:
        Model = ColdStorage;
        break;
      case USER_TYPE.TRADER:
        Model = Trader;
        break;
      default:
        return {
          success: false,
          statusCode: 400,
          error: `Invalid user type: ${userType}`,
        };
    }

    const user = await Model.findOne({
      where: { id: entityId },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
    if (!user) {
      return {
        success: false,
        statusCode: 404,
        error: `${userType} not found.`,
      };
    }

    const agentOnboardedUser = await AgentOnboardedUser.findOne({
      where: { entityId, userType },
    });

    const onboardedByRole = await getUserRole(user.onBoardedBy);

    if (!agentOnboardedUser && onboardedByRole.role === USER_ROLES.AGENT) {
      return {
        success: false,
        statusCode: 404,
        error: `${userType} not found in agentOnboardUser.`,
      };
    }
    if (
      user.status === REGISTRATION_STATUS.APPROVED ||
      user.status === REGISTRATION_STATUS.REJECTED
    ) {
      return {
        success: false,
        statusCode: 400,
        error: `${userType} is already ${user.status}.`,
      };
    }

    await user.update({ status });

    if (
      user.user.isUserOnBoardedOnMobile === true &&
      user.user.hasStartedUsingMobile === true
    ) {
      const UserTypeKeyMap = {
        [USER_TYPE.COLD_STORAGE]: "Cold Storage",
        [USER_TYPE.FARMER]: "Farmer",
        [USER_TYPE.TRADER]: "Trader",
      };

      let description = `Your ${UserTypeKeyMap[userType]} is ${status}`;

      if (reason && reason.trim() !== "") {
        description = reason;
      }

      if (
        userType === USER_TYPE.COLD_STORAGE &&
        status === REGISTRATION_STATUS.REJECTED
      )
        await user.update({ reason });
      else await user.update({ reason: null });

      await sendNotificationService({
        title: `Your ${UserTypeKeyMap[userType]} is ${status}`,
        description,
        senderId: currentUser.id,
        receiverId: user.userId,
        referenceType:
          userType === USER_TYPE.COLD_STORAGE
            ? NotificationType.COLD_STORAGE
            : userType === USER_TYPE.FARMER
            ? NotificationType.FARMER
            : NotificationType.TRADER,
        referenceId: entityId,
      });
    }

    if (agentOnboardedUser) {
      await agentOnboardedUser.update({ statusOfRegistration: status });
    }

    return {
      success: true,
      message: `${userType} status updated to ${status}`,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      error: error.message || "Unexpected error occurred while updating status",
    };
  }
};

export const mobileOnboardingLoginService = async (userData) => {
  const {
    mobile,
    firstName,
    lastName,
    userType,
    location,
    state,
    district,
    cityOrVillage,
    pinCode,
  } = userData;

  const VALID_USER_TYPES = Object.values(USER_REGISTRATION_TYPES);

  if (
    Array.isArray(userType) &&
    !userType.every((type) => VALID_USER_TYPES.includes(type))
  )
    return {
      success: false,
      error:
        "Invalid user type found. Only allowed values are: " +
        VALID_USER_TYPES.join(", "),
    };

  const user = await User.findOne({ where: { mobile } });

  if (!user) {
    return {
      success: false,
      error: "User not found",
    };
  }

  const updatedUser = await user.update({
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    location,
    state,
    district,
    cityOrVillage,
    pinCode,
    userType,
    isUserOnBoardedOnMobile: true,
  });

  return {
    success: true,
    data: updatedUser,
  };
};

export const getUserRole = async (userId) => {
  const user = await User.findByPk(userId);
  return {
    role: user.role,
  };
};

export const toggleMobileUserActiveService = async (
  userId: number,
  isActive: boolean
) => {
  const whereCondition: any = {
    id: userId,
    // role: USER_ROLES.USER,
    [Op.and]: [
      { isUserOnBoardedOnMobile: true },
      { hasStartedUsingMobile: true },
    ],
  };

  const user = await User.findOne({ where: whereCondition });

  if (!user) {
    return {
      success: false,
      statusCode: 404,
      message: "Mobile user not found or not eligible for this operation",
    };
  }

  await user.update({ isActive });

  return {
    success: true,
    statusCode: 200,
    message: `User ${isActive ? "activated" : "deactivated"} successfully.`,
    data: user,
  };
};

export const getMobileUsers = async ({
  page,
  limit,
  kycStatus,
  search,
  activeStatus,
  pbVerificationRequested,
  pbVerificationStatus,
  userType,
  isDeleted,
}) => {
  try {
    const offset = (page - 1) * limit;
    let order: any = [["createdAt", "DESC"]];

    const whereCondition: any = {
      // role: USER_ROLES.USER,
      [Op.and]: [
        { isUserOnBoardedOnMobile: true },
        { hasStartedUsingMobile: true },
      ],
    };

    if (isDeleted !== undefined) {
      whereCondition[Op.and].push({
        isDeleted: isDeleted === "true" ? true : false,
      });
    }

    // Accept: comma-separated string "farmer,trader" OR array ['farmer','trader']
    if (userType) {
      let userTypeArray: string[] = [];

      if (Array.isArray(userType)) {
        // express repeated query param ?userType=a&userType=b -> ['a','b']
        userTypeArray = userType.flatMap((t) =>
          String(t)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        );
      } else if (typeof userType === "string") {
        // comma separated "a,b"
        userTypeArray = userType
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      if (userTypeArray.length > 0) {
        whereCondition[Op.and].push({
          userType: { [Op.overlap]: userTypeArray },
        });
      }
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      const searchId = Number(search);
      whereCondition[Op.and].push({
        [Op.or]: [
          { id: !isNaN(searchId) ? searchId : -1 },
          { name: { [Op.iLike]: searchTerm } },
          { mobile: { [Op.iLike]: searchTerm } },
        ],
      });
    }

    if (activeStatus && activeStatus !== "all") {
      whereCondition[Op.and].push({
        isActive: activeStatus === "active" ? true : false,
      });
    }

    if (pbVerificationRequested !== undefined) {
      whereCondition[Op.and].push({
        pbVerificationRequested: pbVerificationRequested === "true",
      });

      order = [
        [
          fn(
            "COALESCE",
            col("User.pbVerificationRequestedAt"),
            col("User.createdAt")
          ),
          "DESC",
        ],
        ["createdAt", "DESC"],
      ];
    }

    if (pbVerificationStatus && pbVerificationStatus !== "all") {
      whereCondition[Op.and].push({
        pbVerificationStatus,
      });
    }

    const include = [] as any;
    if (kycStatus && kycStatus !== "all") {
      include.push({
        model: KycDocument,
        as: "kycDocument",
        where: { status: kycStatus },
        required: true,
      });
    } else {
      include.push({ model: KycDocument, as: "kycDocument", required: false });
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereCondition,
      attributes: { exclude: ["password_hash", "playerId"] },
      include,
      limit,
      offset,
      order,
    });

    return {
      success: true,
      message: "Users onboarded on mobile.",
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
      users,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch mobile users.",
    };
  }
};

export const updateMobileService = async (userId, payload) => {
  let { firstName, lastName, email } = payload;

  const user = await User.findByPk(userId);
  if (!user)
    return {
      success: false,
      error: "User not found.",
    };

  if (hasValue(email)) {
    const isEmailTaken = await User.findOne({ where: { email } });
    if (isEmailTaken && user.email !== email) {
      return { success: false, error: "Email to be updated already exists." };
    }
  }

  const updatableFields = [
    "firstName",
    "lastName",
    "email",
    "cityOrVillage",
    "state",
    "district",
    "pinCode",
    "location",
    "bio",
    "profilePicture",
    "userType",
  ];

  const updateData: Record<string, any> = {};
  for (const key of updatableFields) {
    if (key in payload) updateData[key] = payload[key];
  }

  if (hasValue(firstName) || hasValue(lastName)) {
    const newFirstName = hasValue(firstName) ? firstName : user.firstName;
    const newLastName = hasValue(lastName) ? lastName : user.lastName;
    updateData["name"] = `${newFirstName} ${newLastName}`.trim();
  }

  const updatedData = await user.update(updateData, { returning: true });

  return {
    success: true,
    data: updatedData,
  };
};

export const getAdminDashboardStats = async (user) => {
  const { oneWeekAgo, oneMonthAgo } = getDateRange();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const now = new Date();

  // helper to fetch sub-admin permissions as a Set
  const getSubAdminPermSet = async (user) => {
    if (!user || user.role !== USER_ROLES.SUB_ADMIN) return new Set<string>();
    const perms = await SubAdminPermission.findAll({
      where: { userId: user.id },
      attributes: ["permission"],
    });
    return new Set(perms.map((p) => p.permission));
  };

  // If super admin -> full access, skip permission checks
  const isSuperAdmin = user && user.role === USER_ROLES.SUPER_ADMIN;
  const isSubAdmin = user && user.role === USER_ROLES.SUB_ADMIN;
  const subAdminPermSet = isSubAdmin
    ? await getSubAdminPermSet(user)
    : new Set();

  const hasPerm = (perm: string) => {
    if (isSuperAdmin) return true;
    if (isSubAdmin) return subAdminPermSet.has(perm);
    return false;
  };

  const userInclude: any = {
    model: User,
    as: "user",
    attributes: ["id", "name", "hasStartedUsingMobile", "pbVerified"],
    where: { hasStartedUsingMobile: true },
    required: true,
  };

  const kycAllowed = hasPerm(PERMISSIONS.KYC_REQUESTS);
  const buyAllowed = hasPerm(PERMISSIONS.BUY_REQUESTS);
  const sellAllowed = hasPerm(PERMISSIONS.SELL_REQUESTS);
  const userMgmtAllowed = hasPerm(PERMISSIONS.USER_MANAGEMENT);
  const mandiAllowed = hasPerm(PERMISSIONS.MANDI_MANAGEMENT);
  const coldStorageAllowed = hasPerm(PERMISSIONS.COLD_STORAGE);
  const pbVerificationAllowed = hasPerm(PERMISSIONS.PB_VERIFICATION);
  const govtSchemesAllowed = hasPerm(PERMISSIONS.GOVT_SCHEMES);
  const eventsAllowed = hasPerm(PERMISSIONS.EVENTS);
  const newsAllowed = hasPerm(PERMISSIONS.NEWS);
  const directoryAllowed = hasPerm(PERMISSIONS.DIRECTORY);
  const promoBannerAllowed = hasPerm(PERMISSIONS.PROMOTIONAL_BANNERS);
  const advertisementAllowed = hasPerm(PERMISSIONS.ADVERTISEMENT);
  const callSupportAllowed = hasPerm(PERMISSIONS.CALL_SUPPORT);
  const helpSupportAllowed = hasPerm(PERMISSIONS.HELP_SUPPORT);
  const cropDiagnosisAllowed = hasPerm(PERMISSIONS.CROP_DIAGNOSIS);

  const [
    pendingKycStats,
    approvedKycStats,
    rejectedKycStats,
    pendingBuyRequestStats,
    lastWeekBuyRequestStats,
    activeBuyRequestStats,
    lastWeekActiveBuyRequestStats,
    activeSellRequestStats,
    lastWeekActiveSellRequestStats,
    totalUsersCount,
    lastMonthTotalUsersCount,
    mandiAgentsCount,
    lastMonthMandiAgentsCount,
    coldStorageCount,
    lastMonthColdStorageCount,
    pbPendingCount,
    pbApprovedCount,
    pbRejectedCount,

    govtSchemesCount,
    lastMonthGovtSchemesCount,

    eventsTotalCount,
    eventsOngoingCount,

    newsTotalCount,
    newsPublishedCount,

    directoryTotalCount,
    directoryLastMonthCount,

    promotionalBannerTotal,
    promotionalBannerActive,

    advertisementTotal,
    advertisementLastMonthCount,

    callSupportTotal,
    callSupportLastMonthCount,

    helpSupportTotal,
    helpSupportLastMonthCount,

    cropPromotionalRequestCount,
    cropOpenExpertQueriesCount,

    recentUsers,
    recentKyc,
    recentBuyRequests,
    recentSellRequests,
  ] = await Promise.all([
    // KYC
    kycAllowed
      ? KycDocument.count({ where: { status: "pending" } })
      : Promise.resolve(null),
    kycAllowed
      ? KycDocument.count({ where: { status: "approved" } })
      : Promise.resolve(null),
    kycAllowed
      ? KycDocument.count({ where: { status: "rejected" } })
      : Promise.resolve(null),

    // BuyRequests
    buyAllowed
      ? BuyRequest.count({ where: { status: BUY_REQUEST_STATUS.PENDING } })
      : Promise.resolve(null),
    buyAllowed
      ? BuyRequest.count({
          where: {
            status: BUY_REQUEST_STATUS.PENDING,
            createdAt: { [Op.gte]: oneWeekAgo },
          },
        })
      : Promise.resolve(null),
    buyAllowed
      ? BuyRequest.count({
          where: { status: BUY_REQUEST_STATUS.APPROVED, isActive: true },
        })
      : Promise.resolve(null),
    buyAllowed
      ? BuyRequest.count({
          where: {
            status: BUY_REQUEST_STATUS.APPROVED,
            isActive: true,
            createdAt: { [Op.gte]: oneWeekAgo },
          },
        })
      : Promise.resolve(null),

    // SellRequests
    sellAllowed
      ? SellRequest.count({
          where: { status: SELL_REQUEST_STATUS.APPROVED, isActive: true },
        })
      : Promise.resolve(null),
    sellAllowed
      ? SellRequest.count({
          where: {
            status: SELL_REQUEST_STATUS.APPROVED,
            isActive: true,
            createdAt: { [Op.gte]: oneWeekAgo },
          },
        })
      : Promise.resolve(null),

    // Users (user management)
    userMgmtAllowed
      ? User.count({
          where: {
            // role: USER_ROLES.USER,
            [Op.and]: [
              { isUserOnBoardedOnMobile: true },
              { hasStartedUsingMobile: true },
            ],
            isActive: true,
          },
        })
      : Promise.resolve(null),

    userMgmtAllowed
      ? User.count({
          where: {
            // role: USER_ROLES.USER,
            [Op.and]: [
              { isUserOnBoardedOnMobile: true },
              { hasStartedUsingMobile: true },
            ],
            createdAt: { [Op.gte]: oneMonthAgo },
            isActive: true,
          },
        })
      : Promise.resolve(null),

    // Mandi agents
    mandiAllowed
      ? MandiAgent.count({ where: { isActive: true } })
      : Promise.resolve(null),
    mandiAllowed
      ? MandiAgent.count({
          where: {
            createdAt: { [Op.gte]: oneMonthAgo },
            isActive: true,
          },
        })
      : Promise.resolve(null),

    // Cold storages (respect userInclude)
    coldStorageAllowed
      ? ColdStorage.count({ include: [userInclude] })
      : Promise.resolve(null),
    coldStorageAllowed
      ? ColdStorage.count({
          where: { createdAt: { [Op.gte]: startOfMonth, [Op.lte]: now } },
          include: [userInclude],
        })
      : Promise.resolve(null),

    // PB verification (users where pbVerificationStatus)
    pbVerificationAllowed
      ? User.count({
          where: { pbVerificationStatus: PB_VERIFICATION_STATUS.PENDING },
        })
      : Promise.resolve(null),
    pbVerificationAllowed
      ? User.count({
          where: { pbVerificationStatus: PB_VERIFICATION_STATUS.APPROVED },
        })
      : Promise.resolve(null),
    pbVerificationAllowed
      ? User.count({
          where: { pbVerificationStatus: PB_VERIFICATION_STATUS.REJECTED },
        })
      : Promise.resolve(null),

    // Govt schemes
    govtSchemesAllowed
      ? GovernmentScheme.count({ where: { isActive: true } })
      : Promise.resolve(null),
    govtSchemesAllowed
      ? GovernmentScheme.count({
          where: { createdAt: { [Op.gte]: oneMonthAgo }, isActive: true },
        })
      : Promise.resolve(null),

    // Events: total and ongoing
    eventsAllowed ? Event.count() : Promise.resolve(null),
    eventsAllowed
      ? Event.count({
          where: { startDate: { [Op.lte]: now }, endDate: { [Op.gte]: now } },
        })
      : Promise.resolve(null),

    // News
    newsAllowed ? News.count() : Promise.resolve(null),
    newsAllowed
      ? News.count({ where: { status: NEWS_STATUS.PUBLISHED } }) // adjust status value if different
      : Promise.resolve(null),

    // Directory
    directoryAllowed ? Directory.count() : Promise.resolve(null),
    directoryAllowed
      ? Directory.count({ where: { createdAt: { [Op.gte]: oneMonthAgo } } })
      : Promise.resolve(null),

    // Promotional banners
    promoBannerAllowed ? Banner.count() : Promise.resolve(null),
    promoBannerAllowed
      ? Banner.count({ where: { isActive: true } })
      : Promise.resolve(null),

    // Advertisements
    advertisementAllowed ? Advertisement.count() : Promise.resolve(null),
    advertisementAllowed
      ? Advertisement.count({
          where: { createdAt: { [Op.gte]: oneMonthAgo } },
        })
      : Promise.resolve(null),

    // Call support / Help support
    callSupportAllowed ? ContactSupport.count() : Promise.resolve(null),
    callSupportAllowed
      ? ContactSupport.count({
          where: { createdAt: { [Op.gte]: oneMonthAgo } },
        })
      : Promise.resolve(null),

    helpSupportAllowed ? UserSupport.count() : Promise.resolve(null),
    helpSupportAllowed
      ? UserSupport.count({
          where: { createdAt: { [Op.gte]: oneMonthAgo } },
        })
      : Promise.resolve(null),

    // Crop diagnosis
    cropDiagnosisAllowed ? PromotionRequest.count() : Promise.resolve(null), // promotional requests for crop diagnosis
    cropDiagnosisAllowed
      ? AskExpert.count({ where: { status: QUERY_STATUS.OPEN } })
      : Promise.resolve(null),

    // Recent lists
    userMgmtAllowed
      ? User.findAll({
          where: {
            // role: USER_ROLES.USER,
            [Op.and]: [
              { isUserOnBoardedOnMobile: true },
              { hasStartedUsingMobile: true },
            ],
            isActive: true,
          },
          limit: 10,
          order: [["createdAt", "DESC"]],
          attributes: ["id", "createdAt"],
        })
      : Promise.resolve(null),

    kycAllowed
      ? KycDocument.findAll({
          limit: 10,
          order: [["createdAt", "DESC"]],
          attributes: ["id", "status", "updatedAt", "isVerified"],
        })
      : Promise.resolve(null),

    buyAllowed
      ? BuyRequest.findAll({
          limit: 10,
          order: [["createdAt", "DESC"]],
          attributes: ["id", "status", "createdAt"],
        })
      : Promise.resolve(null),

    sellAllowed
      ? SellRequest.findAll({
          limit: 10,
          order: [["createdAt", "DESC"]],
          attributes: ["id", "status", "createdAt"],
        })
      : Promise.resolve(null),
  ]);

  // Build activities only from allowed recent lists
  const activities: any[] = [
    ...(recentUsers || []).map((u) => ({
      message: "New user registered",
      timeAgo: formatDistanceToNow(new Date(u.createdAt), { addSuffix: true }),
      createdAt: u.createdAt,
      type: "user",
    })),
    ...(recentKyc || []).map((k) => ({
      message: `KYC ${k.isVerified ? "Approved" : "Rejected"}`,
      timeAgo: formatDistanceToNow(new Date(k.updatedAt), { addSuffix: true }),
      createdAt: k.updatedAt,
      type: "kyc",
    })),
    ...(recentBuyRequests || []).map((b) => ({
      message: "New Buy Request created",
      timeAgo: formatDistanceToNow(new Date(b.createdAt), { addSuffix: true }),
      createdAt: b.createdAt,
      type: "buy_request",
    })),
    ...(recentSellRequests || []).map((s) => ({
      message: "New Sell Request created",
      timeAgo: formatDistanceToNow(new Date(s.createdAt), { addSuffix: true }),
      createdAt: s.createdAt,
      type: "sell_request",
    })),
  ];

  activities.sort(
    (a, b) =>
      (new Date(b.createdAt).getTime() || 0) -
      (new Date(a.createdAt).getTime() || 0)
  );

  const result: any = {
    kycStats: {
      allowed: kycAllowed,
      pendingKycStats,
      approvedKycStats,
      rejectedKycStats,
    },
    buyRequestStats: {
      allowed: buyAllowed,
      pendingBuyRequestStats,
      lastWeekBuyRequestPercent:
        pendingBuyRequestStats === 0
          ? 0
          : parseFloat(
              (
                (lastWeekBuyRequestStats / pendingBuyRequestStats) *
                100
              ).toFixed(0)
            ),
      activeBuyRequestStats,
      lastWeekActiveBuyRequestPercent:
        activeBuyRequestStats === 0
          ? 0
          : parseFloat(
              (
                (lastWeekActiveBuyRequestStats / activeBuyRequestStats) *
                100
              ).toFixed(0)
            ),
    },
    sellRequestStats: {
      allowed: sellAllowed,
      activeSellRequestStats,
      lastWeekActiveSellRequestStats:
        activeSellRequestStats === 0
          ? 0
          : parseFloat(
              (
                (lastWeekActiveSellRequestStats / activeSellRequestStats) *
                100
              ).toFixed(0)
            ),
    },
    mandiAgentStats: {
      allowed: mandiAllowed,
      mandiAgentsCount,
      lastMonthMandiAgentsCount,
    },
    userStats: {
      allowed: userMgmtAllowed,
      totalUsersCount,
      lastMonthTotalUsersPercent:
        totalUsersCount === 0
          ? 0
          : parseFloat(
              ((lastMonthTotalUsersCount / totalUsersCount) * 100).toFixed(0)
            ),
    },
    coldStorageStats: {
      allowed: coldStorageAllowed,
      coldStorageCount,
      lastMonthColdStorageCount,
    },

    pbVerificationStats: {
      allowed: pbVerificationAllowed,
      pending: pbPendingCount,
      approved: pbApprovedCount,
      rejected: pbRejectedCount,
    },
    govtSchemesStats: {
      allowed: govtSchemesAllowed,
      totalActive: govtSchemesCount,
      lastMonthCount: lastMonthGovtSchemesCount,
    },
    eventsStats: {
      allowed: eventsAllowed,
      total: eventsTotalCount,
      ongoing: eventsOngoingCount,
    },
    newsStats: {
      allowed: newsAllowed,
      total: newsTotalCount,
      published: newsPublishedCount,
    },
    directoryStats: {
      allowed: directoryAllowed,
      total: directoryTotalCount,
      lastMonthCount: directoryLastMonthCount,
    },
    promotionalBannerStats: {
      allowed: promoBannerAllowed,
      total: promotionalBannerTotal,
      active: promotionalBannerActive,
    },
    advertisementStats: {
      allowed: advertisementAllowed,
      total: advertisementTotal,
      lastMonthCount: advertisementLastMonthCount,
    },
    callSupportStats: {
      allowed: callSupportAllowed,
      total: callSupportTotal,
      lastMonthCount: callSupportLastMonthCount,
    },
    helpSupportStats: {
      allowed: helpSupportAllowed,
      total: helpSupportTotal,
      lastMonthCount: helpSupportLastMonthCount,
    },
    cropDiagnosisStats: {
      allowed: cropDiagnosisAllowed,
      promotionalRequestCount: cropPromotionalRequestCount,
      openExpertQueriesCount: cropOpenExpertQueriesCount,
    },
  };
  if (isSuperAdmin) {
    result.recentActivities = activities.slice(0, 5);
  }

  return result;
};

export const createSupportTicket = async (
  userId: number,
  subject: string,
  category: string,
  priority: string
) => {
  return await UserSupport.create({
    userId,
    subject,
    category,
    //@ts-ignore
    priority,
    //@ts-ignore
    status: "Open",
  });
};

export const addReplyToTicket = async (ticketId: number, reply: string) => {
  const ticket = await UserSupport.findByPk(ticketId);
  if (!ticket) return { success: false, error: "Ticket not found" };

  ticket.reply = reply;
  await ticket.save();

  return { success: true, message: "Reply added successfully", ticket };
};

export const changeTicketStatus = async (ticketId: number, status: string) => {
  const ticket = await UserSupport.findByPk(ticketId);
  if (!ticket) return { success: false, error: "Ticket not found" };

  //@ts-ignore
  ticket.status = status;
  await ticket.save();

  return { success: true, message: "Status updated successfully", ticket };
};

export const getSupportTickets = async (
  page: number,
  limit: number,
  status?: string,
  search?: string
) => {
  const offset = (page - 1) * limit;

  const whereClause: any = {};
  if (status && status !== "All") {
    whereClause.status = status;
  }

  const includeClause: any = [
    {
      model: User,
      as: "User",
      attributes: ["id", "name", "email"],
      where: search ? { name: { [Op.iLike]: `%${search}%` } } : undefined,
    },
  ];

  const { rows: tickets, count } = await UserSupport.findAndCountAll({
    where: whereClause,
    include: includeClause,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  const totalTickets = await UserSupport.count();
  const openTickets = await UserSupport.count({ where: { status: "Open" } });
  const inProgressTickets = await UserSupport.count({
    where: { status: "In Progress" },
  });
  const resolvedTickets = await UserSupport.count({
    where: { status: "Resolved" },
  });
  const closedTickets = await UserSupport.count({
    where: { status: "Closed" },
  });

  return {
    tickets,
    pagination: {
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    },
    summary: {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
    },
  };
};

export const getSupportTicketById = async (ticketId: number) => {
  const ticket = await UserSupport.findOne({
    where: { id: ticketId },
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  return ticket;
};

export const getUserTypeProfileDetails = async (userId) => {
  const userDetail = await User.findOne({
    where: { id: userId },
    include: [{ model: KycDocument, as: "kycDocument" }],
  });

  if (!userDetail)
    return {
      success: false,
      error: "User not found.",
    };

  if (
    // userDetail.role !== USER_ROLES.USER ||
    userDetail.hasStartedUsingMobile === false &&
    userDetail.isUserOnBoardedOnMobile === true
  )
    return {
      success: false,
      error: "Only Mobile user's profile can be viewed here.",
    };

  const [
    isFarmer,
    isColdStorage,
    isTrader,
    coldStorageList,
    isDirectory,
    directoryList,
  ] = await Promise.all([
    Farmer.findOne({ where: { userId } }),
    ColdStorage.findOne({ where: { userId } }),
    Trader.findOne({ where: { userId } }),
    ColdStorage.findAll({
      where: { userId },
      attributes: [
        "id",
        "name",
        "firstName",
        "lastName",
        "ownerName",
        "mobileNumber",
        "state",
        "district",
        "totalCapacityMt",
        "createdAt",
        "updatedAt",
        "onBoardedBy",
        "status",
        "isAvailable",
      ],
    }),
    Directory.findOne({ where: { userId } }),
    Directory.findAll({
      where: { userId },
      include: [
        {
          model: DirectoryPlan,
          as: "plan",
          attributes: [
            "id",
            "name",
            "priority",
            "homePagePosition",
            "categoryPagePosition",
            "slotLimit",
          ],
          required: false,
        },
      ],
    }),
  ]);

  let farmerProfile, traderProfile, directoryProfile;

  if (isFarmer)
    farmerProfile = await retrieveFarmerProfile(String(isFarmer.id), false);

  if (isTrader)
    traderProfile = await retrieveTraderProfile(String(isTrader.id), false);

  return {
    success: true,
    data: {
      isFarmerOnboarded: !!isFarmer,
      isColdStorageOnboarded: !!isColdStorage,
      isTraderOnboarded: !!isTrader,
      isDirectory: !!isDirectory,
      userDetail,
      farmerProfile,
      traderProfile,
      coldStorageList,
      directoryList,
    },
  };
};

export const updatePbVerificationService = async (
  userId,
  pbVerificationStatus,
  reason,
  id
) => {
  const user = await User.findByPk(userId);

  if (!user) {
    return { statusCode: 404, success: false, message: "User not found" };
  }

  if (
    // user.role !== USER_ROLES.USER ||
    user.hasStartedUsingMobile === false &&
    user.isUserOnBoardedOnMobile === true
  )
    return {
      statusCode: 403,
      success: false,
      message: "PB verification can only be updated for mobile users.",
    };

  const kyc = await KycDocument.findOne({ where: { userId } });

  if (!kyc) {
    return {
      statusCode: 400,
      success: false,
      message:
        "KYC record not found for this user. Ask the user to complete KYC first.",
    };
  }

  if (!kyc.isVerified) {
    return {
      statusCode: 403,
      success: false,
      message:
        "User's KYC is not verified. PB verification cannot be updated until KYC is approved.",
    };
  }

  if (!user.pbVerificationRequested) {
    return {
      statusCode: 400,
      success: false,
      message:
        "User has not requested PB verification yet. Cannot update verification status.",
    };
  }

  user.pbVerificationStatus = pbVerificationStatus;
  user.pbVerified = pbVerificationStatus === PB_VERIFICATION_STATUS.APPROVED;

  if (pbVerificationStatus === PB_VERIFICATION_STATUS.REJECTED) {
    user.reason = reason || null;
  } else {
    user.reason = null;
  }
  await user.save();

  const description =
    user.pbVerificationStatus == PB_VERIFICATION_STATUS.APPROVED
      ? `Your PB Verification Request is ${pbVerificationStatus}`
      : user.reason;

  await sendNotificationService({
    title: `Your PB Verification Request is ${pbVerificationStatus}`,
    description,
    senderId: id,
    receiverId: userId,
    referenceType: NotificationType.USER_PB_VERIFICATION,
    referenceId: userId,
  });

  return {
    statusCode: 200,
    success: true,
    message: `PB verification has been marked as ${pbVerificationStatus}.`,
    data: user,
  };
};

export const requestPbVerificationService = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    return { statusCode: 404, success: false, message: "User not found" };
  }

  if (
    // user.role !== USER_ROLES.USER ||
    user.hasStartedUsingMobile === false &&
    user.isUserOnBoardedOnMobile === true
  )
    return {
      statusCode: 403,
      success: false,
      message: "PB verification can only be updated for mobile users.",
    };

  const [farmerExists, coldStorageExists, traderExists] = await Promise.all([
    Farmer.findOne({
      where: { userId, status: REGISTRATION_STATUS.APPROVED },
    }),
    ColdStorage.findOne({
      where: { userId, status: REGISTRATION_STATUS.APPROVED },
    }),
    Trader.findOne({
      where: { userId, status: REGISTRATION_STATUS.APPROVED },
    }),
  ]);
  const step2Completed =
    !!farmerExists || !!coldStorageExists || !!traderExists;

  if (!step2Completed) {
    return {
      statusCode: 400,
      success: false,
      message:
        "Complete your role information (farmer, cold storage or trader) before requesting PB verification.",
    };
  }

  const kyc = await KycDocument.findOne({ where: { userId } });

  if (!kyc) {
    return {
      statusCode: 400,
      success: false,
      message:
        "KYC record not found. Complete KYC before requesting PB verification.",
    };
  }

  if (!kyc.isVerified) {
    return {
      statusCode: 403,
      success: false,
      message:
        "Your KYC is not verified. PB verification request cannot be made.",
    };
  }

  if (user.pbVerificationRequested) {
    if (user.pbVerificationStatus === PB_VERIFICATION_STATUS.APPROVED) {
      return {
        statusCode: 200,
        success: true,
        message: "PB verification is already approved.",
        data: user,
      };
    }

    if (user.pbVerificationStatus === PB_VERIFICATION_STATUS.PENDING) {
      return {
        statusCode: 200,
        success: true,
        message:
          "You have already requested PB verification. Please wait for admin approval.",
        data: user,
      };
    }
  }

  user.pbVerificationRequested = true;
  user.pbVerificationRequestedAt = new Date();
  user.pbVerificationStatus = PB_VERIFICATION_STATUS.PENDING;
  user.pbVerified = false;

  await user.save();

  const superAdmin = await User.findOne({
    where: { role: USER_ROLES.SUPER_ADMIN },
  });

  await sendNotificationService({
    title: "PB Verification Request",
    description: "New PB Verification Request has been created.",
    senderId: userId,
    receiverId: superAdmin.id,
    referenceType: NotificationType.USER_PB_VERIFICATION,
    referenceId: userId,
  });

  return {
    statusCode: 200,
    success: true,
    message:
      "PB verification request submitted successfully. Awaiting admin approval.",
    data: user,
  };
};

export const getPbVerificationStepStatusService = async (userId: number) => {
  const user = await User.findByPk(userId);

  if (!user) {
    return { statusCode: 404, success: false, message: "User not found" };
  }

  const steps: any = {};

  // Step 1: Complete basic information
  const actualStep1Completed =
    !!user.hasStartedUsingMobile && !!user.isUserOnBoardedOnMobile;

  // Step 2: Complete role information
  const [farmerExists, coldStorageExists, traderExists] = await Promise.all([
    Farmer.findOne({
      where: { userId, status: REGISTRATION_STATUS.APPROVED },
    }),
    ColdStorage.findOne({
      where: { userId, status: REGISTRATION_STATUS.APPROVED },
    }),
    Trader.findOne({
      where: { userId, status: REGISTRATION_STATUS.APPROVED },
    }),
  ]);
  const actualStep2Completed =
    !!farmerExists || !!coldStorageExists || !!traderExists;

  // Step 3: Complete KYC upload
  const kyc = await KycDocument.findOne({ where: { userId } });
  const actualStep3Completed = !!kyc;

  // Step 4: KYC verified
  const actualStep4Completed = kyc?.isVerified ?? false;

  // Apply step-wise gating: once a previous step is false, subsequent ones are locked (false)
  const step1Completed = actualStep1Completed;
  let step2Completed = step1Completed ? actualStep2Completed : false;
  let step3Completed = step2Completed ? actualStep3Completed : false;
  let step4Completed = step3Completed ? actualStep4Completed : false;

  steps.step1Completed = step1Completed;
  steps.step1Message = step1Completed
    ? "Basic information completed."
    : "Complete your basic information before requesting PB verification.";

  steps.step2Completed = step2Completed;
  steps.step2Message = step2Completed
    ? "Role information completed."
    : !step1Completed
    ? "Complete Step 1 (basic information) to unlock role information step."
    : "Complete your role information (farmer, cold storage or trader) before requesting PB verification.";

  steps.step3Completed = step3Completed;
  steps.step3Message = step3Completed
    ? "KYC document uploaded."
    : !step2Completed
    ? "Complete Step 2 (role information) to unlock KYC upload step."
    : "Upload KYC document before requesting PB verification.";

  steps.step4Completed = step4Completed;
  steps.step4Message = step4Completed
    ? "KYC verified."
    : !step3Completed
    ? "Complete Step 3 (KYC upload) to unlock KYC verification step."
    : "Your KYC is not verified. PB verification cannot be requested.";

  // Can request PB verification if all gated steps are true
  const canRequestPbVerification =
    step1Completed && step2Completed && step3Completed && step4Completed;

  return {
    statusCode: 200,
    success: true,
    message: canRequestPbVerification
      ? "All steps completed. User can request PB verification."
      : "Some steps are pending. Complete the steps to request PB verification.",
    data: {
      steps,
      canRequestPbVerification,
      user,
      actual: {
        actualStep1Completed,
        actualStep2Completed,
        actualStep3Completed,
        actualStep4Completed,
      },
    },
  };
};

export const updateUserMobileNumber = async (
  newMobileNumber,
  otp,
  mobile,
  userId
) => {
  newMobileNumber = newMobileNumber.toString();
  otp = otp.toString();

  if (mobile === newMobileNumber)
    return {
      success: false,
      message: "New mobile number is same as the current one",
    };

  const existingUser = await checkExistingUser(newMobileNumber);
  if (existingUser)
    return {
      success: false,
      message: "Mobile number already in use by another user",
    };

  const isValid = await verifyOtpFromDB(newMobileNumber, otp);
  if (!isValid) return { success: false, message: "Invalid or expired OTP" };

  const updates = [
    Farmer.update({ optionalNumber: newMobileNumber }, { where: { userId } }),
    updateUserInDB(userId, { mobile: newMobileNumber }),
    Trader.update({ mobileNumber: newMobileNumber }, { where: { userId } }),
    ColdStorage.update(
      { mobileNumber: newMobileNumber },
      { where: { userId } }
    ),
  ];

  await Promise.all(updates);

  return {
    success: true,
  };
};

export const globalSearchDB = async (q: string) => {
  const term = `%${q}%`;
  const now = new Date();

  const coldStorages = ColdStorage.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.iLike]: term } },
        { ownerName: { [Op.iLike]: term } },
        { village: { [Op.iLike]: term } },
        { district: { [Op.iLike]: term } },
        { state: { [Op.iLike]: term } },
      ],
      isDeleted: false,
      isAvailable: true,
      status: REGISTRATION_STATUS.APPROVED,
    },
    include: [
      {
        model: User,
        as: "user",
        attributes: [],
        where: {
          hasStartedUsingMobile: true,
        },
        required: true,
      },
    ],
    limit: 10,
  });

  const events = Event.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: term } },
        { category: { [Op.iLike]: term } },
        { location: { [Op.iLike]: term } },
      ],
      endDate: { [Op.gte]: now },
    },
    limit: 10,
  });

  const news = News.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: term } },
        { category: { [Op.iLike]: term } },
        { description: { [Op.iLike]: term } },
      ],
      status: NEWS_STATUS.PUBLISHED,
    },
    limit: 10,
  });

  const knowledgeHubs = KnowledgeHub.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: term } },
        { category: { [Op.iLike]: term } },
        { description: { [Op.iLike]: term } },
      ],
      status: KNOWLEDGE_HUB_STATUS.PUBLISHED,
    },
    limit: 10,
  });

  const mandis = MandiList.findAll({
    where: {
      [Op.or]: [
        { mandiName: { [Op.iLike]: term } },
        { address: { [Op.iLike]: term } },
      ],
      isDeleted: false,
    },
    include: [
      {
        model: MandiPrice,
        as: "mandiPrices",
        required: true,
        attributes: [],
      },
    ],
    limit: 10,
  });

  const buyRequests = BuyRequest.findAll({
    where: {
      [Op.or]: [
        { potatoType: { [Op.iLike]: term } },
        { potatoVariety: { [Op.iLike]: term } },
        { additionalComment: { [Op.iLike]: term } },
      ],
      isActive: true,
      status: BUY_REQUEST_STATUS.APPROVED,
    },
    limit: 10,
  });

  const sellRequests = SellRequest.findAll({
    where: {
      [Op.or]: [
        { potatoType: { [Op.iLike]: term } },
        { potatoVariety: { [Op.iLike]: term } },
        { additionalComment: { [Op.iLike]: term } },
        { location: { [Op.iLike]: term } },
      ],
      status: SELL_REQUEST_STATUS.APPROVED,
      isActive: true,
    },
    limit: 10,
  });

  const schemes = GovernmentScheme.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: term } },
        { category: { [Op.iLike]: term } },
        { state: { [Op.iLike]: term } },
      ],
      isActive: true,
    },
    limit: 10,
  });

  return Promise.all([
    coldStorages,
    events,
    news,
    knowledgeHubs,
    mandis,
    buyRequests,
    sellRequests,
    schemes,
  ]).then(
    ([
      coldStorages,
      events,
      news,
      knowledgeHubs,
      mandis,
      buyRequests,
      sellRequests,
      schemes,
    ]) => ({
      coldStorages,
      events,
      news,
      knowledgeHubs,
      mandis,
      buyRequests,
      sellRequests,
      schemes,
    })
  );
};
