import { Op } from "sequelize";
import bcrypt from "bcrypt";

import sequelize from "../database/models/db";
import MandiAgent from "../database/models/mandiAgent";
import User, { USER_ROLES } from "../database/models/user";
import { hasValue } from "../utils/parseQuery";

interface MandiAgentResponse {
  success: boolean;
  error?: string;
  data?: object;
  message?: string;
}

export const addMandiAgent = async (
  mandiAgentData
): Promise<MandiAgentResponse> => {
  const {
    firstName,
    lastName,
    email,
    mobile,
    password,
    confirmPassword,
    state,
    district,
    city,
    pinCode,
    licenseNumber,
  } = mandiAgentData;

  if (password !== confirmPassword)
    return {
      success: false,
      error: "Password and confirm password do not match",
    };

  if (email) {
    const isEmailTaken = await User.findOne({ where: { email } });
    if (isEmailTaken) {
      return { success: false, error: "Email already exists." };
    }
  }
  if (mobile) {
    const isMobileTaken = await User.findOne({ where: { mobile } });
    if (isMobileTaken) {
      return {
        success: false,
        error: "Mobile number already exists.",
      };
    }
  }

  const isDuplicateLicense = await MandiAgent.findOne({
    where: { licenseNumber },
  });

  if (isDuplicateLicense) {
    return {
      success: false,
      error: "Mandi agent with given license number already exists.",
    };
  }

  return await sequelize.transaction(async (t) => {
    const mandiUser = await User.create(
      {
        name: `${firstName} ${lastName}`,
        email,
        mobile,
        password,
        state,
        district,
        cityOrVillage: city,
        pinCode,
        role: USER_ROLES.MANDI_AGENT,
      },
      { transaction: t }
    );

    const mandiAgentDetail = await MandiAgent.create(
      {
        userId: Number(mandiUser.id),
        licenseNumber,
      },
      { transaction: t }
    );

    return {
      success: true,
      data: {
        user: mandiUser,
        agent: mandiAgentDetail,
      },
    };
  });
};

export const getAllMandiAgents = async (
  search?: string,
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;

  const whereUser: any = {};
  if (search) {
    whereUser.name = { [Op.iLike]: `%${search}%` };
  }

  const { count, rows } = await MandiAgent.findAndCountAll({
    include: [
      {
        model: User,
        attributes: [
          "name",
          "mobile",
          "district",
          "cityOrVillage",
          "state",
          "email",
          "pinCode",
        ],
        as: "user",
        where: whereUser,
      },
    ],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  const enrichedResults = rows.map((entry) => {
    const mandiUser = entry.user;

    return {
      id: entry.id,
      name: mandiUser?.name,
      firstName: mandiUser.name.split(" ")[0],
      lastName: mandiUser.name.split(" ")[1],
      contact: mandiUser?.mobile,
      email: mandiUser?.email,
      location: {
        district: mandiUser?.district,
        city: mandiUser?.cityOrVillage,
        state: mandiUser?.state,
        pinCode: mandiUser?.pinCode,
      },
      licenseNumber: entry.licenseNumber,
      status: entry.isActive,
    };
  });

  return {
    data: enrichedResults,
    currentPage: page,
    total: count,
    totalPages: Math.ceil(count / limit),
  };
};

export const getProfileOverview = async (mandiAgentId) => {
  const mandiUser = await MandiAgent.findOne({
    where: { id: mandiAgentId },
    include: [
      {
        model: User,
        as: "user",
      },
    ],
  });

  return {
    mandiUser,
  };
};

export const updateMandiAgentService = async (
  mandiAgentId,
  updateFields
): Promise<MandiAgentResponse> => {
  const {
    licenseNumber,
    password,
    confirmPassword,
    firstName,
    lastName,
    email,
    mobile,
    state,
    district,
    city,
    pinCode,
  } = updateFields;

  const mandiUser = await MandiAgent.findOne({
    where: { id: mandiAgentId },
    include: [
      {
        model: User,
        attributes: [
          "id",
          "name",
          "mobile",
          "district",
          "cityOrVillage",
          "state",
          "email",
          "pinCode",
        ],
        as: "user",
      },
    ],
  });

  if (!mandiUser) {
    return { success: false, error: "Mandi Agent not found." };
  }

  if (hasValue(password) && !hasValue(confirmPassword)) {
    return {
      success: false,
      error: "Confirm password is required when updating password",
    };
  }
  if (
    hasValue(password) &&
    hasValue(confirmPassword) &&
    password !== confirmPassword
  ) {
    return {
      success: false,
      error: "Password and confirm password do not match",
    };
  }
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
    if (isEmailTaken && mandiUser.user.email !== email) {
      return { success: false, error: "Email to be updated already exists." };
    }
  }
  if (hasValue(mobile)) {
    const isMobileTaken = await User.findOne({ where: { mobile } });
    if (isMobileTaken && mandiUser.user.mobile !== mobile) {
      return {
        success: false,
        error: "Mobile number to be updated already exists.",
      };
    }
  }

  if (licenseNumber) {
    const isDuplicateLicense = await MandiAgent.findOne({
      where: { licenseNumber },
    });

    if (isDuplicateLicense) {
      return {
        success: false,
        error: "Mandi agent with given license number already exists.",
      };
    }
  }

  const mandiAgentUpdates: any = {};
  const userUpdates: any = {};

  if (hasValue(licenseNumber)) mandiAgentUpdates.licenseNumber = licenseNumber;
  if (hasValue(firstName) || hasValue(lastName)) {
    userUpdates.name = `${firstName || ""} ${lastName || ""}`.trim();
  }
  if (hasValue(email)) userUpdates.email = email;
  if (hasValue(mobile)) userUpdates.mobile = mobile;
  if (hasValue(state)) userUpdates.state = state;
  if (hasValue(district)) userUpdates.district = district;
  if (hasValue(city)) userUpdates.cityOrVillage = city;
  if (hasValue(pinCode)) userUpdates.pinCode = pinCode;
  if (hasValue(password)) {
    userUpdates.password_hash = await bcrypt.hash(password, 10);
  }

  const result = await sequelize.transaction(async (t) => {
    let updatedMandiAgentRow = null;
    let updatedMandiUserRow = null;

    if (Object.keys(mandiAgentUpdates).length) {
      const [, updated] = await MandiAgent.update(mandiAgentUpdates, {
        where: { id: mandiAgentId },
        transaction: t,
        returning: true,
      });
      updatedMandiAgentRow = updated[0] || null;
    }

    if (Object.keys(userUpdates).length) {
      const [, updated] = await User.update(userUpdates, {
        where: { id: mandiUser.user.id },
        transaction: t,
        returning: true,
      });
      updatedMandiUserRow = updated[0] || null;
    }

    return {
      mandiAgent: updatedMandiAgentRow,
      mandiUser: updatedMandiUserRow,
    };
  });

  return {
    success: true,
    message: "Mandi Agent updated successfully.",
    data: result,
  };
};

export const deleteMandiAgentService = async (
  mandiAgentId
): Promise<MandiAgentResponse> => {
  const mandiUser = await MandiAgent.findOne({
    where: { id: mandiAgentId },
  });

  if (!mandiUser) {
    return { success: false, error: "Mandi Agent not found." };
  }
  return await sequelize.transaction(async (t) => {
    await MandiAgent.destroy({ where: { id: mandiAgentId }, transaction: t });

    await User.destroy({ where: { id: mandiUser.userId }, transaction: t });

    return {
      success: true,
      message: "Mandi Agent deleted successfully.",
    };
  });
};
