import {
  changePasswordService,
  checkExistingUser,
  createUserInDB,
  createUserWithAgent,
  findAgentWithUser,
  findUserByEmail,
  findUserByPkInDB,
  forgotPasswordService,
  getDashboardCounts,
  getRegistrationTypes,
  getUserProfileDB,
  registerInitialUser,
  resetPasswordService,
  retrieveRecentRegisteredForAdmin,
  updateProfileService,
  updateRegistrationTypes,
  updateRegistrationStatus,
  mobileOnboardingLoginService,
  updateMobileService,
  getMobileUsers,
  getAdminDashboardStats,
  createSupportTicket,
  addReplyToTicket,
  changeTicketStatus,
  getSupportTickets,
  getSupportTicketById,
  updatePbVerificationService,
  requestPbVerificationService,
  getUserTypeProfileDetails,
  getPbVerificationStepStatusService,
  updateUserMobileNumber,
  globalSearchDB,
  toggleMobileUserActiveService,
} from "../services/userServices";
import jwt from "jsonwebtoken";
import { createOtp, verifyOtpFromDB } from "../services/otpServices";
import User, { USER_ROLES } from "../database/models/user";
import SubAdminWebPermission from "../database/models/subAdminWebPermission";
import {
  buildPermissionsResponse,
  buildSubAdminPermissionsResponse,
} from "../utils/commonCode";
import SubAdminPermission from "../database/models/subAdminPermission";
import MobileUpdateSession, {
  MOBILE_TYPE,
} from "../database/models/mobileUpdateSession";
import { getFarmerProfileCompletion } from "../services/farmerServices";
import { getColdStorageProfileCompletion } from "../services/coldStorageService";
import { getTraderProfileCompletion } from "../services/traderService";
import { renderTemplate } from "../services/emailTemplate";
import { sendEmail } from "../services/emailService";
import { Op } from "sequelize";
import {
  getProfileOverview,
  updateOwnMandiAgentService,
} from "../services/mandiAgentService";
import MandiAgent from "../database/models/mandiAgent";
import KycDocument from "../database/models/kycDocuments";

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
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "An error occurred during signup",
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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "User has been deactivated. Please contact the admin.",
      });
    }

    // Compare the password with the hashed password in the database
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
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

    if (user.role === USER_ROLES.SUB_ADMIN) {
      const subAdminPermissions = await SubAdminPermission.findAll({
        where: { userId: user.id },
        attributes: ["permission"],
      });

      const allowed = subAdminPermissions.map((p) => p.permission);
      permissions = buildSubAdminPermissionsResponse(allowed);
    }

    // Return the success response with the token
    return res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        secondaryMobile: user.secondaryMobile,
        permissions,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "An error occurred during login",
    });
  }
};

export const createAgent = async (req, res) => {
  try {
    const result = await createUserWithAgent(req.body);

    const { user, sharedCredentials } = result;

    if (user.email) {
      const loginUrl =
        process.env.NODE_ENV === "production"
          ? "https://onboarding.potatobazaar.com/agent/login"
          : "https://potato-bazar.vercel.app/agent/login";

      const html = renderTemplate("agentCredentials", {
        name: user.name,
        email: user.email,
        password: sharedCredentials.password,
        agentId: sharedCredentials.agentId,
        loginUrl,
      });

      sendEmail({
        to: user.email,
        subject: "Your Agent Account Credentials",
        html,
      });
    }

    return res.status(201).json({
      message: "Agent created successfully",
      credentialsToShare: result.sharedCredentials,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Error creating agent",
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
        message:
          "Agent account has been deactivated. Please contact the admin.",
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
    const existingUser = await checkExistingUser(mobile);

    if (
      existingUser &&
      (existingUser.hasStartedUsingMobile ||
        existingUser.isUserOnBoardedOnMobile) &&
      !existingUser.isActive
    ) {
      return res.status(403).json({
        message: "User has been deactivated. Please contact the admin.",
      });
    }

    await createOtp(mobile);
    return res
      .status(200)
      .json({ success: true, message: "OTP has been sent successfully." });
  } catch (err: any) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { mobile, email, otp, hasStartedUsingMobile, playerId } = req.body;

    const isValid = await verifyOtpFromDB(mobile, otp, email);
    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    const registrationType = await getRegistrationTypes(mobile);

    const existingUser = await checkExistingUser(mobile);
    if (existingUser) {
      if (
        (existingUser.hasStartedUsingMobile ||
          existingUser.isUserOnBoardedOnMobile) &&
        !existingUser.isActive
      ) {
        return res.status(403).json({
          success: false,
          message: "User has been deactivated. Please contact the admin.",
        });
      }

      if (hasStartedUsingMobile) {
        await existingUser.update({ hasStartedUsingMobile: true, playerId });
      }

      const token = jwt.sign({ id: existingUser.id }, JWT_SECRET);
      return res.status(200).json({
        success: true,
        message: "OTP verified. User already exists.",
        token,
        user: existingUser,
        registrationType,
      });
    }

    const createUser = await registerInitialUser(
      mobile,
      hasStartedUsingMobile,
      playerId
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified",
      createUser,
      registrationType,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "OTP verification failed",
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { mobile, email } = req.body;
    if (mobile) {
      const existingUser = await checkExistingUser(mobile);

      if (
        existingUser &&
        (existingUser.hasStartedUsingMobile ||
          existingUser.isUserOnBoardedOnMobile) &&
        !existingUser.isActive
      ) {
        return res.status(403).json({
          message: "User has been deactivated. Please contact the admin.",
        });
      }
    }
    await createOtp(mobile, email);
    return res
      .status(200)
      .json({ success: true, message: "OTP resent successfully" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Failed to resend OTP" });
  }
};

export const sendExportOtps = async (req, res) => {
  try {
    const { mobile, secondaryMobile } = req.body;
    const { mobile: userMobile, secondaryMobile: userSecondaryMobile } =
      req.user;

    if (mobile !== userMobile || secondaryMobile !== userSecondaryMobile) {
      return res.status(403).json({
        success: false,
        message:
          "Provided mobile numbers do not match the admin account records",
      });
    }

    await createOtp(mobile);
    await createOtp(secondaryMobile);

    return res.status(200).json({
      success: true,
      message: "OTPs sent to both registered mobile numbers",
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Failed to send OTPs" });
  }
};

export const UserLoginOnMobile = async (req, res) => {
  try {
    const userOnboardedOnMobile = await mobileOnboardingLoginService(req.body);

    if (!userOnboardedOnMobile.success)
      return res
        .status(400)
        .json({ success: false, message: userOnboardedOnMobile.error });

    const token = jwt.sign({ id: userOnboardedOnMobile.data.id }, JWT_SECRET);

    return res.status(200).json({
      success: true,
      message: "User Onboarded on mobile Successfully.",
      user: { token, ...userOnboardedOnMobile.data.toJSON() },
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
    return res.status(200).json({ message: "Success", data: counts });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to fetch dashboard stats" });
  }
};

export const updateUserRegistrationTypes = async (req, res) => {
  try {
    const { mobile, registration_types } = req.body;

    if (!mobile || !Array.isArray(registration_types)) {
      return res
        .status(400)
        .json({ message: "mobile and registration_types[] are required" });
    }

    const updatedUser = await updateRegistrationTypes(
      mobile,
      registration_types
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Registration types updated", user: updatedUser });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to update registration types" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await getUserProfileDB(userId);
    return res.status(200).json({ message: "User Profile", userData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to update registration types" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { mobile, email } = req.body;

    const response = await forgotPasswordService(mobile, email);

    if (!response.success)
      return res.status(400).json({ message: response.error });

    return res.status(200).json({
      message: "OTP has been sent successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in forgot password", error: error.message });
  }
};

export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { otp, mobile, email } = req.body;

    const isValid = await verifyOtpFromDB(mobile, otp, true, email);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const orConditions = [];
    if (email) orConditions.push({ email });
    if (mobile) orConditions.push({ mobile });

    await User.update(
      { otpVerified: true },
      { where: { [Op.or]: orConditions } }
    );

    return res.status(200).json({ message: "Otp verified successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in verifying otp", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { mobile, email, password, confirmPassword } = req.body;

    const response = await resetPasswordService(
      mobile,
      email,
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
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
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

    if (
      role !== USER_ROLES.SUPER_ADMIN &&
      role !== USER_ROLES.ADMIN &&
      role !== USER_ROLES.AGENT &&
      role !== USER_ROLES.SUB_ADMIN &&
      role !== USER_ROLES.SUB_ADMIN_WEB
    ) {
      return res.status(403).json({
        message:
          "Only Super Admin, Admin, Agent, Sub Admin, and Sub Admin Web roles can update the profile.",
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
    const { mobile } = req.query;
    const registrationTypes = await getRegistrationTypes(mobile);

    return res
      .status(200)
      .json({ message: "Registration Types", registrationTypes });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve user's registration types.",
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
    const { status, userType, userId, reason } = req.body;
    const currentUser = req.user;

    const response = await updateRegistrationStatus(
      status,
      userType,
      userId,
      currentUser,
      reason
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

export const toggleMobileUserActive = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { isActive } = req.body;

    const result: any = await toggleMobileUserActiveService(userId, isActive);

    if (!result.success) {
      return res.status(result.statusCode || 400).json({
        success: false,
        message: result.message || result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (err) {
    console.error("Failed to toggle mobile user active:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: err.message,
    });
  }
};

export const retrieveMobileUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      kycStatus,
      search = "",
      activeStatus,
      pbVerificationRequested,
      pbVerificationStatus,
      userType
    } = req.query;

    const response = await getMobileUsers({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      kycStatus,
      search,
      activeStatus,
      pbVerificationRequested,
      pbVerificationStatus,
      userType
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

    return res.status(200).json({
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

    const userDetail = await User.findOne({
      where: id,
      include: [{ model: KycDocument, as: "kycDocument" }],
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

export const updatePbVerification = async (req, res) => {
  try {
    const { id } = req.user;

    const result = await updatePbVerificationService(
      req.params.id,
      req.body.pbVerificationStatus,
      req.body.reason,
      id
    );

    return res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update pb verification",
    });
  }
};

export const requestPbVerification = async (req, res) => {
  try {
    const result = await requestPbVerificationService(req.user.id);

    return res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to request PB verification",
    });
  }
};

export const getPbVerificationStepStatus = async (req, res) => {
  try {
    const result = await getPbVerificationStepStatusService(req.user.id);

    return res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get PB verification Step Status",
    });
  }
};

export const getMobileUserProfileByAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
    const userDetail = await getUserTypeProfileDetails(userId);

    if (!userDetail.success)
      return res.status(400).json({
        success: false,
        error: userDetail.error,
      });

    return res.status(200).json({
      success: true,
      message: "User detail fetched successfully.",
      data: userDetail.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed in retrieving mobile user's profile.",
    });
  }
};

export const getMobileUserRoleInformation = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const userDetail = await getUserTypeProfileDetails(userId);

    if (!userDetail.success)
      return res.status(400).json({
        success: false,
        error: userDetail.error,
      });

    return res.status(200).json({
      success: true,
      message: "User role information retrieved successfully.",
      data: userDetail.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch user role information.",
    });
  }
};

export const deleteMobileUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const userDetail = await User.findByPk(userId);

    if (!userDetail)
      return res
        .status(400)
        .json({ success: false, message: "User not found." });

    if (
      userDetail.role !== USER_ROLES.USER ||
      (userDetail.hasStartedUsingMobile === false &&
        userDetail.isUserOnBoardedOnMobile === true)
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

export const deleteCurrentMobileUser = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const userDetail = await User.findByPk(userId);

    if (!userDetail)
      return res
        .status(400)
        .json({ success: false, message: "User not found." });

    if (
      userDetail.role !== USER_ROLES.USER ||
      (userDetail.hasStartedUsingMobile === false &&
        userDetail.isUserOnBoardedOnMobile === true)
    )
      return res.status(400).json({
        success: false,
        message: "Account deletion is only allowed for mobile users.",
      });

    await User.destroy({ where: { id: userId } });

    return res.status(200).json({
      success: true,
      message: "Mobile user account deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete mobile user account.",
    });
  }
};

export const retrieveAdminDashboardStats = async (req, res) => {
  try {
    const dashboarStatistics = await getAdminDashboardStats(req.user);

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Statistics retrieved successfully.",
      data: dashboarStatistics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed in retrieving dashboard statistics.",
    });
  }
};

export const createTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subject, category, priority } = req.body;

    const ticket = await createSupportTicket(
      userId,
      subject,
      category,
      priority
    );

    return res.status(201).json({
      success: true,
      message: "Support ticket created successfully.",
      ticket,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create support ticket.",
    });
  }
};

export const replyToSupportTicket = async (req, res) => {
  try {
    const { ticketId, reply } = req.body;
    const response = await addReplyToTicket(ticketId, reply);

    if (!response.success) {
      return res.status(404).json({ success: false, message: response.error });
    }

    return res.status(200).json({
      success: true,
      message: response.message,
      ticket: response.ticket,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSupportTicketStatus = async (req, res) => {
  try {
    const { ticketId, status } = req.body;
    const response = await changeTicketStatus(ticketId, status);

    if (!response.success) {
      return res.status(404).json({ success: false, message: response.error });
    }

    return res.status(200).json({
      success: true,
      message: response.message,
      ticket: response.ticket,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const listSupportTickets = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const response = await getSupportTickets(
      Number(page),
      Number(limit),
      status as string,
      search as string
    );

    return res.status(200).json({
      success: true,
      message: "Support tickets retrieved successfully.",
      ...response,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getTicketDetails = async (req, res) => {
  try {
    const { ticketId } = req.query;

    const ticket = await getSupportTicketById(Number(ticketId));

    return res.status(200).json({
      success: true,
      message: "Support ticket details retrieved successfully.",
      ticketDetails: ticket,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyOldMobileNumberForUpdate = async (req, res) => {
  try {
    let { mobile, otp, mobileNumberType } = req.body;
    const { id } = req.user;

    if (
      (mobileNumberType === MOBILE_TYPE.PRIMARY &&
        mobile !== req.user.mobile) ||
      (mobileNumberType === MOBILE_TYPE.SECONDARY &&
        mobile !== req.user.secondaryMobile)
    ) {
      return res.status(400).json({
        success: false,
        message: "Mobile number entered is incorrect.",
      });
    }

    const isValid = await verifyOtpFromDB(mobile, otp);
    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    const isMobileUpdateSessionExists = await MobileUpdateSession.findOne({
      where: { userId: id, type: mobileNumberType },
    });

    if (isMobileUpdateSessionExists) {
      await MobileUpdateSession.update(
        {
          currentNumberLastVerifiedAt: new Date(),
        },
        { where: { userId: id } }
      );
    } else {
      await MobileUpdateSession.create({
        userId: id,
        type: mobileNumberType,
        currentMobile: mobile,
        currentNumberLastVerifiedAt: new Date(),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Current mobile number verified successfully.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyNewMobileNumberBeforeUpdate = async (req, res) => {
  try {
    let { mobile, mobileNumberType, otp } = req.body;
    const { id } = req.user;

    const user = await checkExistingUser(mobile);
    if (user && user.id !== id)
      return res
        .status(400)
        .json({ success: false, message: "Mobile number already exist." });

    const mobileSessionData: any = await MobileUpdateSession.findOne({
      where: { userId: id, type: mobileNumberType },
    });

    if (!mobileSessionData)
      return res.status(400).json({
        success: false,
        message: "Current mobile number is not verified.",
      });

    const diff =
      Date.now() -
      new Date(mobileSessionData.currentNumberLastVerifiedAt).getTime();

    if (diff > 20 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "Current Number verification expired. Please verify again.",
      });
    }

    const isValid = await verifyOtpFromDB(mobile, otp);
    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    await MobileUpdateSession.destroy({
      where: { userId: id, type: mobileNumberType },
    });

    const isSecondaryMobile =
      mobileNumberType === MOBILE_TYPE.SECONDARY ? true : false;

    if (isSecondaryMobile)
      await User.update({ secondaryMobile: mobile }, { where: { id } });
    else await User.update({ mobile }, { where: { id } });

    return res
      .status(200)
      .json({ success: true, message: "Mobile Number updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProfileCompletion = async (req, res) => {
  try {
    const userId = req.user.id;

    const [farmerResult, coldStorageResult, traderResult] = await Promise.all([
      getFarmerProfileCompletion(userId),
      getColdStorageProfileCompletion(userId),
      getTraderProfileCompletion(userId),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        farmerProfile: farmerResult,
        coldStorageProfile: coldStorageResult,
        traderProfile: traderResult,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate profile completion",
    });
  }
};

export const getMandiAgentProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const mandiAgent = await MandiAgent.findOne({ where: { userId } });

    if (!mandiAgent) {
      return res.status(404).json({
        success: false,
        message: "No Mandi Agent found for this user",
      });
    }

    const result = await getProfileOverview(mandiAgent.id);

    if (!result.mandiUser) {
      return res.status(404).json({
        success: false,
        message: "Mandi Agent profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mandi Agent profile fetched successfully",
      data: result.mandiUser,
    });
  } catch (error) {
    console.error("Error fetching Mandi Agent profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateOwnMandiAgentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const response = await updateOwnMandiAgentService(userId, req.body);

    if (!response.success) {
      return res.status(400).json({
        success: false,
        message: response.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update Mandi Agent profile",
    });
  }
};

export const verifyAndUpdateNewNumber = async (req, res) => {
  try {
    let { otp, newMobileNumber } = req.body;
    const { id: userId, mobile } = req.user;

    if (!otp)
      return res
        .status(400)
        .json({ success: false, message: "Otp is required." });

    if (!newMobileNumber)
      return res.status(400).json({
        success: false,
        message: "New Mobile number is required.",
      });

    const response = await updateUserMobileNumber(
      newMobileNumber,
      otp,
      mobile,
      userId
    );

    if (!response.success)
      return res
        .status(400)
        .json({ success: false, message: response.message });

    return res.status(200).json({
      success: true,
      message: "Mobile number updated successfully",
      newMobileNumber,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to verify or update mobile number for user.",
    });
  }
};

export const globalSearchController = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Query parameter 'q' is required",
      });
    }

    const results = await globalSearchDB(q);

    return res.json({
      success: true,
      query: q,
      results,
    });
  } catch (err) {
    console.error("Global Search Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
