import User from "../database/models/user";
import Agent from '../database/models/agent';
import { generateAgentId, generateRandomPassword } from '../utils/generate';
import Farmer from "../database/models/farmer";
import ColdStorage from "../database/models/coldStorage";
import { Op, where } from 'sequelize';


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
    password,
    role: 'agent',
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
    farmersByAdmins,
  ] = await Promise.all([
    Farmer.count(),
    Farmer.count({ where: { createdAt: { [Op.gte]: oneWeekAgo } } }),
    Farmer.count({ where: { createdAt: { [Op.gte]: oneMonthAgo } } }),
    Farmer.count({ where: { onBoardedBy: { [Op.in]: agentIds } } }),
    Farmer.count({ where: { onBoardedBy: { [Op.in]: adminIds } } }),
  ]);

  // ColdStorages counts
  const [
    totalColdStorages,
    coldStoragesLastWeek,
    coldStoragesLastMonth,
    coldStoragesByAgents,
    coldStoragesByAdmins,
  ] = await Promise.all([
    ColdStorage.count(),
    ColdStorage.count({ where: { createdAt: { [Op.gte]: oneWeekAgo } } }),
    ColdStorage.count({ where: { createdAt: { [Op.gte]: oneMonthAgo } } }),
    ColdStorage.count({ where: { onBoardedBy: { [Op.in]: agentIds } } }),
    ColdStorage.count({ where: { onBoardedBy: { [Op.in]: adminIds } } }),
  ]);

  // Calculate percentages helper
  const calcPercent = (count: number, total: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0;

  // Construct onboarding ratio stats for Farmer
  const farmerAgentPercent = calcPercent(farmersByAgents, totalFarmers);
  const farmerAdminPercent = calcPercent(farmersByAdmins, totalFarmers);

  // Construct onboarding ratio stats for Cold Storage
  const coldStorageAgentPercent = calcPercent(coldStoragesByAgents, totalColdStorages);
  const coldStorageAdminPercent = calcPercent(coldStoragesByAdmins, totalColdStorages);

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
      byAdmins: farmersByAdmins,
      onboardingRatio: {
        agentOnboarded: `${farmersByAgents} (${farmerAgentPercent}%)`,
        selfOnboarded: `${farmersByAdmins} (${farmerAdminPercent}%)`,
      },
    },
    coldStorages: {
      total: totalColdStorages,
      lastWeek: coldStoragesLastWeek,
      lastMonth: coldStoragesLastMonth,
      byAgents: coldStoragesByAgents,
      byAdmins: coldStoragesByAdmins,
      onboardingRatio: {
        agentOnboarded: `${coldStoragesByAgents} (${coldStorageAgentPercent}%)`,
        selfOnboarded: `${coldStoragesByAdmins} (${coldStorageAdminPercent}%)`,
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

export const adminGetAgentsList = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
      const agents = await User.findAll({
        where:{role:'agent'},
        include:[
          {
            model: Agent,
            as: 'agentProfile'
          }
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]]});
      return agents;
  } catch (error) {
    throw error;
  }
}

export const deleteAgentById = async (id) =>{
  try {
    const agent = await Agent.findByPk(id);

    if (!agent || agent.isDeleted) {
      return false;
    }

    agent.isDeleted = true;
    await agent.save();

    return true;
  } catch (error) {
    console.error('Soft delete failed:', error);
    return false;
  }
}

export const changeAgentStatus = async(id)=>{
  try {
    const agent = await Agent.findByPk(id);
    agent.is_active= !agent.is_active;
    await agent.save();
    return agent;
  } catch (error) {
    console.error('Agent status update failed:', error);
    return null;
  }
}

export const getAgentByIdFromDB = async (id) => {
  try {
    const getAgentAllDetails = await Agent.findOne({
      where: { id },
      include: [
        { 
          model: User, 
          as: 'user' 
        },
      ],
    });
    return getAgentAllDetails;
  } catch (error) {
    throw error;
  }
}

export const updateAgentById = async (id, updateData) => {
  try{
    const agent = await Agent.findByPk(id, { include: [{ model: User, as: 'user' }] });
    if (!agent || agent.isDeleted) {
      return null;
    }
    // Update Agent fields
    if (updateData.phone !== undefined) agent.phone = updateData.phone;
    if (updateData.district !== undefined) agent.district = updateData.district;
    if (updateData.address !== undefined) agent.address = updateData.address;
    if (updateData.note !== undefined) agent.note = updateData.note;
    if (updateData.is_active !== undefined) agent.is_active = updateData.is_active;
    // Update User (name, email)
    const user = await User.findByPk(agent.userId);
    if (user) {
      if (updateData.name !== undefined) user.name = updateData.name;
      if (updateData.email !== undefined) user.email = updateData.email;
      await user.save();
    }
    console.log("agent---------->",updateData)
    await agent.save();
    return agent;
  }
  catch (error) {
    throw error;
  }
}
updateAgentById