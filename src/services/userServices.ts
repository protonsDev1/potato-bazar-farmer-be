import User, { REGISTRATION_STATUS, USER_ROLES } from "../database/models/user";
import Agent from '../database/models/agent';
import { generateAgentId, generateRandomPassword } from '../utils/generate';
import Farmer from "../database/models/farmer";
import ColdStorage from "../database/models/coldStorage";
import { createOtp } from "./otpServices";
import { Op, Sequelize } from 'sequelize';
import { formatDistanceToNow } from "date-fns";
import bcrypt from 'bcrypt';
import Trader from "../database/models/trader/trader";
import { formatDate } from "../utils/dateFormat";
import AgentOnboardedUser, { USER_TYPE } from "../database/models/agentOnboardedUsers";
import KycDocument from "../database/models/kycDocuments";
import { hasValue } from "../utils/parseQuery";
import SubAdminWebPermission from "../database/models/subAdminWebPermission";
import { WEB_ACTIONS } from "../utils/constants/permissions";
import BuyRequest, { BUY_REQUEST_STATUS } from "../database/models/buyRequest";
import dayjs from "dayjs";
import MandiAgent from "../database/models/mandiAgent";
import SellRequest from "../database/models/sellRequest";

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
    include: [{ model: User, as: 'user' }],
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
    Agent.count({ where: { isDeleted: false} }),
    Agent.count({
      where: { isDeleted: false, createdAt: { [Op.gte]: oneWeekAgo } },
    }),
    Agent.count({
      where: { isDeleted: false, createdAt: { [Op.gte]: oneMonthAgo } },
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
    Farmer.count({ where: { isDeleted: false } }),
    Farmer.count({
      where: { createdAt: { [Op.gte]: oneWeekAgo }, isDeleted: false },
    }),
    Farmer.count({
      where: { createdAt: { [Op.gte]: oneMonthAgo }, isDeleted: false },
    }),
    Farmer.count({
      where: { onBoardedBy: { [Op.in]: agentIds }, isDeleted: false },
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
        isDeleted: false,
      },
    }),
    Farmer.count({
      where: { onBoardedBy: { [Op.in]: adminIds }, isDeleted: false },
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
    ColdStorage.count({ where: { isDeleted: false } }),
    ColdStorage.count({
      where: { createdAt: { [Op.gte]: oneWeekAgo }, isDeleted: false },
    }),
    ColdStorage.count({
      where: { createdAt: { [Op.gte]: oneMonthAgo }, isDeleted: false },
    }),
    ColdStorage.count({
      where: { onBoardedBy: { [Op.in]: agentIds }, isDeleted: false },
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
        isDeleted: false,
      },
    }),
    ColdStorage.count({
      where: { onBoardedBy: { [Op.in]: adminIds }, isDeleted: false },
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
    Trader.count({ where: { isDeleted: false } }),
    Trader.count({
      where: { createdAt: { [Op.gte]: oneWeekAgo }, isDeleted: false },
    }),
    Trader.count({
      where: { createdAt: { [Op.gte]: oneMonthAgo }, isDeleted: false },
    }),
    Trader.count({
      where: { onBoardedBy: { [Op.in]: agentIds }, isDeleted: false },
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
        isDeleted: false,
      },
    }),
    Trader.count({
      where: { onBoardedBy: { [Op.in]: adminIds }, isDeleted: false },
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

export const checkExistingUser = async (mobile) =>{
  return await User.findOne({ where: { mobile } });
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

  const [isFarmer, isColdStorage, isTrader] = await Promise.all([
    Farmer.findOne({ where: { userId: user.id } }),
    ColdStorage.findOne({ where: { userId: user.id } }),
    Trader.findOne({ where: { userId: user.id } }),
  ]);

  return {
    isFarmerOnboarded: !!isFarmer,
    isColdStorageOnboarded: !!isColdStorage,
    isTraderOnboarded: !!isTrader,
  };
};

export const registerInitialUser = async (mobile, hasStartedUsingMobile) =>{
  return await User.create({
    name: 'Guest',
    mobile,
    role:'user',
    otpVerified: true,
    hasStartedUsingMobile: !!hasStartedUsingMobile
  });
};

export const updateRegistrationTypes = async (
  mobile,
  newTypes
) => {
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
   return  await User.update(updateData, {
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
      Trader.count({where: {onBoardedBy: agentId}})
    ]);

    result.onboardingStats = {
      farmerCount,
      coldStorageCount,
      traderCount,
    };
  }
  return result;
};

export const forgotPasswordService = async (mobile: string) => {
  try {
    const userResponse = await User.findOne({ where: { mobile } });

    if (!userResponse) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    await createOtp(mobile);

    await User.update({ otpVerified: false }, { where: { mobile } });

    return {
      success: true,
    };
  } catch (error) {
    throw new Error(`Error in forgot password : ${error.message}`);
  }
};

export const resetPasswordService = async (
  mobile: string,
  password: string,
  confirmPassword: string
) => {
  try {
    if (password !== confirmPassword)
      return {
        success: false,
        error: "Password and Confirm Password should be same.",
      };

    const userResponse = await User.findOne({ where: { mobile } });

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

    await User.update({ otpVerified: false }, { where: { mobile } });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.update({ password_hash: hashedPassword }, { where: { mobile } });

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

    const userData= await findUserByPkInDB(id);

    if(!userData.success)return {success:false,error:userData.error};

   const isMatch=await userData.data.validatePassword(oldPassword);

    if (!isMatch)
    return {
        success: false,
        error: "Old Password does not match.",
      };

    if (newPassword !== confirmNewPassword)
    return {success:false,error:"New Password and Confirm New Password should be same."}

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password_hash: hashedPassword }, { where: {id} });

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
      const user = await checkExistingUser(mobile);
      if (user && user.id !== userId)
        return { success: false, error: "Mobile number already exist." };
    }

    await User.update({ ...data }, { where: { id: userId } });

    // Update Agent
    if (role === "agent") {
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
        limit: 5
      }),
      ColdStorage.findAll({
        order: [["createdAt", "DESC"]],
        limit: 5
      }),
      Trader.findAll({
        order: [["createdAt", "DESC"]],
        limit: 5
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
}

export const updateRegistrationStatus = async (
  status: string,
  userType: string,
  userId: number,
  currentUser: User
) => {
  try {
    if (currentUser.role === USER_ROLES.ADMIN) {
    } else if (currentUser.role === USER_ROLES.SUB_ADMIN_WEB) {
      const normalizedUserType = normalizeUserType(userType);

      const hasReviewPermission = await SubAdminWebPermission.findOne({
        where: {
          userId: currentUser.id,
          module: normalizedUserType,
          action: WEB_ACTIONS.REVIEW,
        },
      });

      if (!hasReviewPermission) {
        return {
          success: false,
          statusCode: 403,
          error: `Access denied: Missing review permission for ${normalizedUserType}`,
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

    const user = await Model.findByPk(userId);
    if (!user) {
      return {
        success: false,
        statusCode: 404,
        error: `${userType} not found.`,
      };
    }

    const agentOnboardedUser = await AgentOnboardedUser.findOne({
      where: { userId: user.userId, userType },
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

  const user = await User.findOne({ where: { mobile } });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await user.update({
    name: `${firstName} ${lastName}`,
    location,
    state,
    district,
    cityOrVillage,
    pinCode,
    userType,
    isUserOnBoardedOnMobile: true,
  });

  return updatedUser;
};

export const getUserRole = async (userId) => {
  const user = await User.findByPk(userId);
  return {
    role: user.role
  };
};

export const getMobileUsers = async ({ page, limit, kycStatus, search, activeStatus }) => {
  try {
  const offset = (page - 1) * limit;
  
  
  const whereCondition = {
  role: USER_ROLES.USER,
  [Op.or]: [
  { isUserOnBoardedOnMobile: true },
  { hasStartedUsingMobile: true },
  ],
  };
  
  if (search) {
      //@ts-ignore
  whereCondition.name = { [Op.iLike]: `%${search}%` };
  }
  
  
  if (activeStatus && activeStatus !== "all") {
      //@ts-ignore
  whereCondition.isActive = activeStatus === "active" ? true : false;
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
  include,
  limit,
  offset,
  });
  
  
  return {
  success: true,
  message: "Users onboarded on mobile.",
  users,
  pagination: {
  total: count,
  page,
  limit,
  totalPages: Math.ceil(count / limit),
  },
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

  if (
    (hasValue(firstName) && !hasValue(lastName)) ||
    (!hasValue(firstName) && hasValue(lastName))
  ) {
    return {
      success: false,
      error:
        "First name and last name should either both be updated, or neither.",
    };
  }

  if (hasValue(email)) {
    const isEmailTaken = await User.findOne({ where: { email } });
    if (isEmailTaken && user.email !== email) {
      return { success: false, error: "Email to be updated already exists." };
    }
  }

  const updatableFields = [
    "email",
    "cityOrVillage",
    "state",
    "pinCode",
    "location",
    "bio",
    "profilePicture"
  ];

  const updateData: Record<string, any> = {};
  for (const key of updatableFields) {
    if (key in payload) updateData[key] = payload[key];
  }

  if (hasValue(firstName) && hasValue(lastName))
    updateData["name"] = `${firstName} ${lastName}`;

  const updatedData = await user.update(updateData, { returning: true });

  return {
    success: true,
    data: updatedData,
  };
};

export const getAdminDashboardStats = async () => {
  const { oneWeekAgo, oneMonthAgo } = getDateRange();

  const [
    pendingKycStats,
    approvedKycStats,
    rejectedKycStats,
    pendingBuyRequestStats,
    lastWeekBuyRequestStats,
    activeSellRequestStats,
    lastWeekActiveSellRequestStats,
    totalUsersCount,
    lastMonthTotalUsersCount,
    mandiAgentsCount,
    lastMonthMandiAgentsCount,
  ] = await Promise.all([
    KycDocument.count({ where: { status: "pending" } }),
    KycDocument.count({ where: { status: "approved" } }),
    KycDocument.count({ where: { status: "rejected" } }),

    BuyRequest.count({ where: { status: BUY_REQUEST_STATUS.PENDING } }),
    BuyRequest.count({
      where: {
        status: BUY_REQUEST_STATUS.PENDING,
        createdAt: { [Op.gte]: oneWeekAgo },
      },
    }),

    SellRequest.count({ where: { isActive: true } }),
    SellRequest.count({
      where: { isActive: true, createdAt: { [Op.gte]: oneWeekAgo } },
    }),

    User.count({
      where: {
        role: USER_ROLES.USER,
        [Op.or]: [
          { isUserOnBoardedOnMobile: true },
          { hasStartedUsingMobile: true },
        ],
        isActive: true,
      },
    }),
    User.count({
      where: {
        role: USER_ROLES.USER,
        [Op.or]: [
          { isUserOnBoardedOnMobile: true },
          { hasStartedUsingMobile: true },
        ],
        createdAt: { [Op.gte]: oneMonthAgo },
        isActive: true,
      },
    }),

    MandiAgent.count({ where: { isActive: true } }),
    MandiAgent.count({
      where: {
        createdAt: { [Op.gte]: oneMonthAgo },
        isActive: true,
      },
    }),
  ]);

  const [recentUsers, recentKyc, recentBuyRequests, recentSellRequests] =
    await Promise.all([
      User.findAll({
        where: {
          role: USER_ROLES.USER,
          [Op.or]: [
            { isUserOnBoardedOnMobile: true },
            { hasStartedUsingMobile: true },
          ],
          isActive: true,
        },
        limit: 10,
        order: [["createdAt", "DESC"]],
        attributes: ["id", "createdAt"],
      }),
      KycDocument.findAll({
        limit: 10,
        order: [["updatedAt", "DESC"]],
        attributes: ["id", "status", "updatedAt"],
      }),
      BuyRequest.findAll({
        limit: 10,
        order: [["createdAt", "DESC"]],
        attributes: ["id", "status", "createdAt"],
      }),
      SellRequest.findAll({
        limit: 10,
        order: [["createdAt", "DESC"]],
        attributes: ["id", "status", "createdAt"],
      }),
    ]);

  const activities: any = [
    ...recentUsers.map((u) => ({
      message: "New user registered",
      timeAgo: formatDistanceToNow(new Date(u.createdAt), { addSuffix: true }),
      createdAt: u.createdAt,
    })),
    ...recentKyc.map((k) => ({
      message: `KYC ${k.isVerified ? "Approved" : "Rejected"} `,
      timeAgo: formatDistanceToNow(new Date(k.updatedAt), { addSuffix: true }),
      createdAt: k.updatedAt,
    })),
    ...recentBuyRequests.map((b) => ({
      message: "New Buy Request created",
      timeAgo: formatDistanceToNow(new Date(b.createdAt), { addSuffix: true }),
      createdAt: b.createdAt,
    })),
    ...recentSellRequests.map((s) => ({
      message: "New Sell Request created",
      timeAgo: formatDistanceToNow(new Date(s.createdAt), { addSuffix: true }),
      createdAt: s.createdAt,
    })),
  ];

  activities.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    kycStats: {
      pendingKycStats,
      approvedKycStats,
      rejectedKycStats,
    },
    buyRequestStats: {
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
    },

    sellRequestStats: {
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
      mandiAgentsCount,
      lastMonthMandiAgentsCount,
    },
    userStats: {
      totalUsersCount,
      lastMonthTotalUsersPercent:
        totalUsersCount === 0
          ? 0
          : parseFloat(
              ((lastMonthTotalUsersCount / totalUsersCount) * 100).toFixed(0)
            ),
    },
    recentActivities: activities.slice(0, 5),
  };
};
