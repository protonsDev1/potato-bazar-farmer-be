import User from "../database/models/user";
import Agent from '../database/models/agent';
import { generateAgentId, generateRandomPassword } from '../utils/generate';


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