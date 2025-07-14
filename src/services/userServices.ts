import User from "../database/models/user";
import Agent from '../database/models/agent';
import { generateAgentId, generateRandomPassword } from '../utils/generate';
import Farmer from "../database/models/farmer";
import ColdStorage from "../database/models/coldStorage";
import { createOtp } from "./otpServices";

import { Op, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

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
  district,
  note,
}: any) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error('User with this email already exists');

  const password = generateRandomPassword();
  const agentId = generateAgentId();

  // Ensure uniqueness of agentId
  const existingAgent = await Agent.findOne({ where: { agentId } });
  if (existingAgent) throw new Error('Generated agent ID conflict. Please retry.');

  const user = await User.create({
    name,
    email,
    mobile: phone,
    password,
    role: 'agent',
    location: address
  });

  const agent = await Agent.create({
    userId: user.id,
    phone,
    address,
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

  // Agents counts
  const [totalAgents, agentsLastWeek, agentsLastMonth] = await Promise.all([
    User.count({ where: { role: 'agent' } }),
    User.count({ where: { role: 'agent', createdAt: { [Op.gte]: oneWeekAgo } } }),
    User.count({ where: { role: 'agent', createdAt: { [Op.gte]: oneMonthAgo } } }),
  ]);

  // Get agent and admin user IDs
  const [agentUsers, adminUsers] = await Promise.all([
    User.findAll({ where: { role: 'agent' }, attributes: ['id'] }),
    User.findAll({ where: { role: 'admin' }, attributes: ['id'] }),
  ]);
  const agentIds = agentUsers.map(u => u.id);
  const adminIds = adminUsers.map(u => u.id);

  // Farmers counts
  const [
    totalFarmers,
    farmersLastWeek,
    farmersLastMonth,
    farmersByAgents,
    farmersSelfOnboarded,
  ] = await Promise.all([
    Farmer.count(),
    Farmer.count({ where: { createdAt: { [Op.gte]: oneWeekAgo } } }),
    Farmer.count({ where: { createdAt: { [Op.gte]: oneMonthAgo } } }),
    Farmer.count({ where: { onBoardedBy: { [Op.in]: agentIds } } }),
    Farmer.count({
      where: {
        [Op.and]: [
          { onBoardedBy: { [Op.not]: null } },
          Sequelize.where(Sequelize.col("onBoardedBy"), "=", Sequelize.col("userId")),
        ],
      },
    }),
  ]);

  // ColdStorages counts
  const [
    totalColdStorages,
    coldStoragesLastWeek,
    coldStoragesLastMonth,
    coldStoragesByAgents,
    coldStoragesSelfOnboarded,
  ] = await Promise.all([
    ColdStorage.count(),
    ColdStorage.count({ where: { createdAt: { [Op.gte]: oneWeekAgo } } }),
    ColdStorage.count({ where: { createdAt: { [Op.gte]: oneMonthAgo } } }),
    ColdStorage.count({ where: { onBoardedBy: { [Op.in]: agentIds } } }),
    ColdStorage.count({
      where: {
        [Op.and]: [
          { onBoardedBy: { [Op.not]: null } },
          Sequelize.where(Sequelize.col("onBoardedBy"), "=", Sequelize.col("userId")),
        ],
      },
    }),
  ]);

  // Calculate percentages helper
  const calcPercent = (count: number, total: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0;

  // Construct onboarding ratio stats for Farmer
  const farmerAgentPercent = calcPercent(farmersByAgents, totalFarmers);
  const selfOnboardedFarmerPercent = calcPercent(farmersSelfOnboarded, totalFarmers);

  // Construct onboarding ratio stats for Cold Storage
  const coldStorageAgentPercent = calcPercent(coldStoragesByAgents, totalColdStorages);
  const selfOnboardedColdStoragePercent = calcPercent(coldStoragesSelfOnboarded, totalColdStorages);

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
      onboardingRatio: {
        agentOnboarded: `${farmersByAgents} (${farmerAgentPercent}%)`,
        selfOnboarded: `${farmersSelfOnboarded} (${selfOnboardedFarmerPercent}%)`,
      },
    },
    coldStorages: {
      total: totalColdStorages,
      lastWeek: coldStoragesLastWeek,
      lastMonth: coldStoragesLastMonth,
      byAgents: coldStoragesByAgents,
      selfOnboarded: coldStoragesSelfOnboarded,
      onboardingRatio: {
        agentOnboarded: `${coldStoragesByAgents} (${coldStorageAgentPercent}%)`,
        selfOnboarded: `${coldStoragesSelfOnboarded} (${selfOnboardedColdStoragePercent}%)`,
      },
    },
  };
};

export const checkExistingUser = async (mobile) =>{
  return await User.findOne({ where: { mobile } });
};

export const registerInitialUser = async (mobile) =>{
  return await User.create({
    name: 'Guest',
    mobile,
    role:'user',
    otpVerified:true,
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
    const agentId = user.agentProfile.id;

    const [farmerCount, coldStorageCount] = await Promise.all([
      Farmer.count({ where: { onBoardedBy: agentId } }),
      ColdStorage.count({ where: { onBoardedBy: agentId } }),
    ]);

    result.onboardingStats = {
      farmerCount,
      coldStorageCount,
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
