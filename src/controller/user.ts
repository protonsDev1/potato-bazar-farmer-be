import { Request, Response } from 'express';
import { checkExistingUser, createUserInDB, createUserWithAgent, findAgentWithUser, findUserByEmail, getDashboardCounts, registerInitialUser, updateRegistrationTypes } from '../services/userServices';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createOtp,verifyOtpFromDB } from '../services/otpServices';
const JWT_SECRET = process.env.JWT_SECRET as string;

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await createUserInDB({
      name,
      email,
      password,
      role,
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || 'An error occurred during signup',
    });
  }
};

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input using the Joi schema
    
  
      // Find the user by email
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare the password with the hashed password in the database
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Generate the JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );
  
      // Return the success response with the token
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || 'An error occurred during login',
      });
    }
  };


export const createAgent = async (req, res) => {
  try {
    const result = await createUserWithAgent(req.body);

    return res.status(201).json({
      message: 'Agent created successfully',
      credentialsToShare: result.sharedCredentials,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || 'Error creating agent',
    });
  }
};

export const agentLogin = async (req, res) => {
  try {
   

    const { agentId, password } = req.body;
    const agent = await findAgentWithUser(agentId);
    // @ts-ignore 
    if (!agent || !agent.user) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    // @ts-ignore 

    if (agent.user.role !== 'agent') {
      return res.status(403).json({ message: 'Access denied. Not an agent.' });
    }
    // @ts-ignore 

    const isPasswordValid = await agent.user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
          // @ts-ignore 

      { id: agent.user.id, role: agent.user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Login error' });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    const otpRecord = await createOtp(mobile);
    return res.status(200).json({ message: 'OTP sent', otp: otpRecord.otp }); // for demo
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to send OTP' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const isValid = await verifyOtpFromDB(mobile, otp);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }
    const existingUser = await checkExistingUser(mobile);
    if (existingUser) {
      return res.status(200).json({ message: 'OTP verified. User already exists.', user: existingUser });
    };

    const createUser = await registerInitialUser(mobile);

    return res.status(200).json({ message: 'OTP verified',createUser });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'OTP verification failed' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const counts = await getDashboardCounts();
    return res.status(200).json({ message: 'Success', data: counts });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to fetch dashboard stats' });
  }
};

export const updateUserRegistrationTypes = async (req, res) => {
  try {
    const { mobile, registration_types } = req.body;

    if (!mobile || !Array.isArray(registration_types)) {
      return res.status(400).json({ message: 'mobile and registration_types[] are required' });
    }

    const updatedUser = await updateRegistrationTypes(mobile, registration_types);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Registration types updated', user: updatedUser });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to update registration types' });
  }
};



