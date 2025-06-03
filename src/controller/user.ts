import { Request, Response } from 'express';
import { changePasswordService, checkExistingUser, createUserInDB, createUserWithAgent, findAgentWithUser, findUserByEmail, findUserByPkInDB, forgotPasswordService, getDashboardCounts, getUserProfileDB, registerInitialUser, resetPasswordService, updateProfileService, updateRegistrationTypes } from '../services/userServices';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createOtp,verifyOtpFromDB } from '../services/otpServices';
import User from '../database/models/user';


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
      console.log("secretOrPrivateKey");
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
        { id: user.id },
        JWT_SECRET,
        { expiresIn: "24h" } // Token expires in 1 day
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

    if (!agent || !agent.user) {
      return res.status(404).json({ message: "Agent not found" });
    }

    if (agent.user.role !== "agent") {
      return res.status(403).json({ message: "Access denied. Not an agent." });
    }

    const isPasswordValid = await agent.user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    agent.user.lastLogin = new Date();
    await agent.user.save();
    
    const token = jwt.sign({ id: agent.user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Login error" });
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

export const getUserProfile = async (req, res) => {
  try{
    const userId = req.user.id;
    const userData = await getUserProfileDB(userId);
    return res.status(200).json({ message: 'User Profile', userData });
  }catch(err){
    return res.status(500).json({ message: err.message || 'Failed to update registration types' });
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { mobile } = req.body;

    const response = await forgotPasswordService(mobile);

    if (!response.success)
      return res.status(400).json({ message: response.error });

    return res.status(200).json({
      message:
        "Otp has been sent successfully.Please contact support team if you have not received the otp.",
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    return res
      .status(500)
      .json({ message: "Error in forgot password", error: error.message });
  }
};

export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { otp, mobile } = req.body;

    const isValid = await verifyOtpFromDB(mobile, otp);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    await User.update({ otpVerified: true }, { where: { mobile } });

    return res.status(200).json({ message: "Otp verified successfully." });
  } catch (error) {
    console.error("Error in verifying otp:", error);
    return res
      .status(500)
      .json({ message: "Error in verifying otp", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { mobile, password, confirmPassword } = req.body;

    const response = await resetPasswordService(
      mobile,
      password,
      confirmPassword
    );

    if (!response.success)
      return res.status(400).json({ message: response.error });

    return res
      .status(200)
      .json({ message: "Password has been reset successfully!" });
  } catch (error) {
    console.error("Error reseting password:", error);

    return res.status(500).json({
      message: "Error reseting user's password",
      error: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword,confirmNewPassword } = req.body;
    const { id } = req.user;

    const response = await changePasswordService(
      oldPassword,
      newPassword,
      confirmNewPassword,
       id
    );

    if (!response.success)
      return res.status(400).json({ message: response.error });

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      message: "Error changing user's password",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id, role } = req.user;

    const data = req.body;

    if (role === "agent" || role=== "user")
      return res
        .status(400)
        .json({
          message:
            "Only Admin are authorized to update profile here.",
        });

    const updateResponse = await updateProfileService(data, id);

    if (!updateResponse.success)
      return res.status(400).json({ message: updateResponse.error });

    return res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};