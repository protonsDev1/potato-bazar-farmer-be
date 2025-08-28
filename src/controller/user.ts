import { changePasswordService, checkExistingUser, createUserInDB, createUserWithAgent, findAgentWithUser, findUserByEmail, findUserByPkInDB, forgotPasswordService, getDashboardCounts, getRegistrationTypes, getUserProfileDB, registerInitialUser, resetPasswordService, retrieveRecentRegisteredForAdmin, updateProfileService, updateRegistrationTypes, updateRegistrationStatus, mobileOnboardingLoginService, updateMobileService, getMobileUsers } from '../services/userServices';
import jwt from 'jsonwebtoken';
import { createOtp,verifyOtpFromDB } from '../services/otpServices';
import User, { USER_ROLES } from '../database/models/user';
import SubAdminWebPermission from '../database/models/subAdminWebPermission';
import { buildPermissionsResponse } from '../utils/commonCode';
import KycDocument from '../database/models/kycDocuments';


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
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Compare the password with the hashed password in the database
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid password' });
      }
  
      // Generate the JWT token
      const token = jwt.sign(
        { id: user.id },
        JWT_SECRET,
        { expiresIn: "24h" } // Token expires in 1 day
      );
  
      let permissions = null;
      if (user.role === USER_ROLES.SUB_ADMIN_WEB) {
        const subAdminPermissions = await SubAdminWebPermission.findAll({
          where: { userId: user.id },
          attributes: ["module", "action"],
        });

        const allowed = subAdminPermissions.map((p) => `${p.module}:${p.action}`);
        permissions = buildPermissionsResponse(allowed);
      }

      // Return the success response with the token
      return res.status(200).json({
        message: 'Login successful',
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
          permissions,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
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

    if (!agent.isActive) {
      return res.status(403).json({
        message: "Agent account is deactivated. Please contact admin.",
      });
    }

    if (agent.isDeleted) {
      return res.status(403).json({
        message: "Agent account has been deleted by admin.",
      });
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

    const agentResponse = {
      id: agent.id,
      name: agent.user.name,
      agentId: agent.agentId,
      phone: agent.phone,
      address: agent.address,
      district: agent.district,
      state: agent.state,
      note: agent.note,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      agent: agentResponse,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Login error" });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    const otpRecord = await createOtp(mobile);
    return res.status(200).json({ success: true, message: 'OTP sent', otp: otpRecord.otp }); // for demo
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Failed to send OTP' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp, hasStartedUsingMobile } = req.body;

    const isValid = await verifyOtpFromDB(mobile, otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const registrationType = await getRegistrationTypes(mobile);

    const existingUser = await checkExistingUser(mobile);
    if (existingUser) {
      if (hasStartedUsingMobile) {
        await existingUser.update({ hasStartedUsingMobile: true });
      }
      
      const token = jwt.sign({ id: existingUser.id }, JWT_SECRET, {
        expiresIn: "24h",
      });
      return res
        .status(200)
        .json({
          success: true,
          message: "OTP verified. User already exists.",
          token,
          user: existingUser,
          registrationType,
        });
    }

    const createUser = await registerInitialUser(mobile, hasStartedUsingMobile);

    return res
      .status(200)
      .json({ success: true, message: "OTP verified", createUser, registrationType });
  } catch (err: any) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "OTP verification failed" });
  }
};

export const UserLoginOnMobile = async (req, res) => {
  try {
    const userOnboardedOnMobile = await mobileOnboardingLoginService(req.body);

    const token = jwt.sign({ id: userOnboardedOnMobile.id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      success: true,
      message: "User Onboarded on mobile Successfully.",
      user: { token, ...userOnboardedOnMobile.toJSON() },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to onboard on mobile.",
    });
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

    if (role !== "admin" && role !== "agent") {
      return res
        .status(403)
        .json({
          message:
            "Only admins and agents are allowed to update the profile.",
        });
    }
    const updateResponse = await updateProfileService(data, id, role);

    if (!updateResponse.success)
      return res.status(400).json({ message: updateResponse.error });

    return res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};

export const retrieveRegistrationTypes = async (req, res) => {
  try {
    const {mobile} = req.query;
    const registrationTypes = await getRegistrationTypes(mobile);

    return res
      .status(200)
      .json({ message: "Registration Types", registrationTypes });
  } catch (error) {
    return res
      .status(500)
      .json({
        message:
          error.message || "Failed to retrieve user's registration types.",
      });
  }
};

export const getRecentRegistrationsForAdmin = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin")
      return res.status(400).json({
        message:
          "Only Admins are authorized to retrieve recent registered users.",
      });

    const recentRegistrations = await retrieveRecentRegisteredForAdmin();
    return res
      .status(200)
      .json({ message: "Retreived recent registrations", recentRegistrations });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed in retreiving recent registrations.",
    });
  }
};

export const adminUpdateRegistrationStatus = async (req, res) => {
  try {
    const { status, userType, userId } = req.body;
    const currentUser = req.user;

    const response = await updateRegistrationStatus(
      status,
      userType,
      userId,
      currentUser
    );

    if (!response.success)
      return res
        .status(response.statusCode || 400)
        .json({ message: response.error });

    return res.status(200).json({ message: response.message });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed in updating status.",
    });
  }
};

export const retrieveMobileUsers = async (req, res) => {
  try {
  const { page = 1, limit = 10, kycStatus, search = "", activeStatus } = req.query;
  
  
  const response = await getMobileUsers({
  page: parseInt(page, 10),
  limit: parseInt(limit, 10),
  kycStatus,
  search,
  activeStatus,
  });
  
  
  if (!response.success)
  return res.status(400).json({ message: response.error });
  
  
  return res.status(200).json(response);
  } catch (error) {
  res.status(500).json({
  success: false,
  message: error.message || "Failed in retrieving mobile users.",
  });
  }
};

export const updateMobileUserProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const response = await updateMobileService(id, req.body);

    if (!response.success)
      return res
        .status(400)
        .json({ success: response.success, message: response.error });

    return res
      .status(200)
      .json({
        success: response.success,
        message: "User profile updated successfully.",
        data: response.data,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed in updating mobile users.",
    });
  }
};

export const getMobileUserProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const userDetail = await User.findByPk(id);

    return res
      .status(200)
      .json({
        success: true,
        message: "User detail fetched successfully.",
        data: userDetail,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed in retrieving mobile user's profile.",
    });
  }
};

export const getMobileUserProfileByAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
    const userDetail = await User.findOne({
      where: { id: userId },
      include: [{ model: KycDocument, as: "kycDocument" }],
    });

    if (!userDetail)
      return res
        .status(400)
        .json({ success: false, message: "User not found." });

    if (
      userDetail.role !== USER_ROLES.USER ||
      (userDetail.hasStartedUsingMobile === false &&
        userDetail.isUserOnBoardedOnMobile === false)
    )
      return res.status(400).json({
        success: false,
        message: "Only Mobile user's profile can be viewed here.",
      });

    return res.status(200).json({
      success: true,
      message: "User detail fetched successfully.",
      data: userDetail,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed in retrieving mobile user's profile.",
    });
  }
};

export const deleteMobileUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const userDetail = await User.findByPk(userId);

    if(!userDetail)
      return res.status(400).json({success: false, message: "User not found."});

    if (
      userDetail.role !== USER_ROLES.USER ||
      (userDetail.hasStartedUsingMobile === false &&
        userDetail.isUserOnBoardedOnMobile === false)
    )
      return res.status(400).json({
        success: false,
        message: "Only Mobile user can be deleted here.",
      });

    await User.destroy({ where: { id: userId } });

    return res
      .status(200)
      .json({ success: true, message: "Mobile user deleted successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed in deleting mobile user.",
    });
  }
};
