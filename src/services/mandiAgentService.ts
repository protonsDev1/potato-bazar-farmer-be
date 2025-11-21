import { Op } from "sequelize";
import bcrypt from "bcrypt";

import sequelize from "../database/models/db";
import MandiAgent from "../database/models/mandiAgent";
import User, { USER_ROLES } from "../database/models/user";
import { hasValue } from "../utils/parseQuery";
import MandiAllotedToMandiAgent from "../database/models/mandiAllotedToMandiAgent";
import MandiList from "../database/models/mandiList";
import City from "../database/models/city";

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
    remarks,
    mandiIds,
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

  const existingMandis = await MandiList.findAll({
    where: { id: { [Op.in]: mandiIds } },
    attributes: ["id"],
    raw: true,
  });

  const existingIds = existingMandis.map((m) => m.id);

  const invalidIds = mandiIds.filter((id) => !existingIds.includes(id));

  if (invalidIds.length > 0) {
    return {
      success: false,
      error: `Invalid mandiId(s): ${invalidIds.join(", ")}`,
    };
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
  const keyMap: Record<number, number> = {};
  mandiIds.forEach((id) => {
    keyMap[id] = (keyMap[id] || 0) + 1;
  });

  for (const id in keyMap) {
    const count = keyMap[id];

    if (count === 1) continue;

    return {
      success: false,
      error: `mandiId ${id} occurs ${count} times`,
    };
  }

  return await sequelize.transaction(async (t) => {
    const mandiUser = await User.create(
      {
        firstName,
        lastName,
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
        remarks,
      },
      { transaction: t }
    );

    if (Array.isArray(mandiIds)) {
      for (const id of mandiIds) {
        await MandiAllotedToMandiAgent.create(
          {
            mandiAgentId: mandiAgentDetail.id,
            mandiId: id,
          },
          { transaction: t }
        );
      }
    }

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

  const whereCondition: any = {};

  if (search?.trim()) {
    const searchTerm = `%${search.trim()}%`;
    whereCondition[Op.or] = [
      { licenseNumber: { [Op.iLike]: searchTerm } },
      { "$user.name$": { [Op.iLike]: searchTerm } },
      { "$user.email$": { [Op.iLike]: searchTerm } },
      { "$user.state$": { [Op.iLike]: searchTerm } },
    ];
  }
  const { count, rows } = await MandiAgent.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: User,
        attributes: [
          "firstName",
          "lastName",
          "name",
          "mobile",
          "district",
          "cityOrVillage",
          "state",
          "email",
          "pinCode",
          "createdAt",
          "updatedAt"
        ],
        as: "user",
        required: false,
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
      firstName: mandiUser?.firstName || mandiUser?.name.split(" ")[0],
      lastName: mandiUser?.lastName || mandiUser?.name.split(" ")[1],
      contact: mandiUser?.mobile,
      email: mandiUser?.email,
      location: {
        district: mandiUser?.district,
        city: mandiUser?.cityOrVillage,
        state: mandiUser?.state,
        pinCode: mandiUser?.pinCode,
      },
      licenseNumber: entry.licenseNumber,
      remarks: entry.remarks,
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
      {
        model: MandiAllotedToMandiAgent,
        as: "allotedMandisToAgent",
        include: [
          {
            model: MandiList,
            as: "mandiName",
            include: [
              {
                model: City,
                as: "city",
              },
            ],
          },
        ],
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
    remarks,
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
    mandiIds,
    isActive,
  } = updateFields;

  const mandiUser = await MandiAgent.findOne({
    where: { id: mandiAgentId },
    include: [
      {
        model: User,
        attributes: [
          "id",
          "firstName",
          "lastName",
          "name",
          "mobile",
          "district",
          "cityOrVillage",
          "state",
          "email",
          "pinCode",
          "isActive",
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
      where: {
        licenseNumber,
        id: { [Op.ne]: mandiAgentId },
      },
    });

    if (isDuplicateLicense) {
      return {
        success: false,
        error: "Mandi agent with given license number already exists.",
      };
    }
  }

  if (mandiIds && mandiIds.length > 0) {
    const existingMandis = await MandiList.findAll({
      where: { id: { [Op.in]: mandiIds } },
      attributes: ["id"],
      raw: true,
    });

    const existingIds = existingMandis.map((m) => m.id);

    const invalidIds = mandiIds.filter((id) => !existingIds.includes(id));

    if (invalidIds.length > 0) {
      return {
        success: false,
        error: `Invalid mandiId(s): ${invalidIds.join(", ")}`,
      };
    }
  }

  const mandiAgentUpdates: any = {};
  const userUpdates: any = {};

  if (licenseNumber !== undefined)
    mandiAgentUpdates.licenseNumber = licenseNumber;
  if (remarks !== undefined) mandiAgentUpdates.remarks = remarks;
  if (hasValue(isActive)) {
    mandiAgentUpdates.isActive = isActive;
    userUpdates.isActive = isActive;
  }
  if (hasValue(firstName)) userUpdates.firstName = firstName;
  if (hasValue(lastName)) userUpdates.lastName = lastName;
  if (hasValue(email)) userUpdates.email = email;
  if (hasValue(firstName) || hasValue(lastName)) {
    const newFirstName = hasValue(firstName)
      ? firstName
      : mandiUser.user.firstName;
    const newLastName = hasValue(lastName) ? lastName : mandiUser.user.lastName;
    userUpdates.name = `${newFirstName} ${newLastName}`.trim();
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
    let updatedAllotedMandis = [];

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

    if (Array.isArray(mandiIds)) {
      await MandiAllotedToMandiAgent.destroy({
        where: { mandiAgentId },
        transaction: t,
      });

      const newRows = mandiIds.map((mandiId) => ({
        mandiAgentId,
        mandiId,
      }));

      updatedAllotedMandis = await MandiAllotedToMandiAgent.bulkCreate(
        newRows,
        { transaction: t }
      );
    }

    return {
      mandiAgent: updatedMandiAgentRow,
      mandiUser: updatedMandiUserRow,
      allotedMandis: updatedAllotedMandis,
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

export const updateOwnMandiAgentService = async (
  userId: number,
  updateFields: any
) => {
  const {
    licenseNumber,
    remarks,
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
    where: { userId },
    include: [
      {
        model: User,
        attributes: [
          "id",
          "firstName",
          "lastName",
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
      where: {
        licenseNumber,
        id: { [Op.ne]: mandiUser.id },
      },
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

  if (licenseNumber !== undefined)
    mandiAgentUpdates.licenseNumber = licenseNumber;
  if (remarks !== undefined) mandiAgentUpdates.remarks = remarks;
  if (hasValue(firstName)) userUpdates.firstName = firstName;
  if (hasValue(lastName)) userUpdates.lastName = lastName;
  if (hasValue(email)) userUpdates.email = email;
  if (hasValue(firstName) || hasValue(lastName)) {
    const newFirstName = hasValue(firstName)
      ? firstName
      : mandiUser.user.firstName;
    const newLastName = hasValue(lastName) ? lastName : mandiUser.user.lastName;
    userUpdates.name = `${newFirstName} ${newLastName}`.trim();
  }
  if (hasValue(mobile)) userUpdates.mobile = mobile;
  if (hasValue(state)) userUpdates.state = state;
  if (hasValue(district)) userUpdates.district = district;
  if (hasValue(city)) userUpdates.cityOrVillage = city;
  if (hasValue(pinCode)) userUpdates.pinCode = pinCode;

  const result = await sequelize.transaction(async (t) => {
    let updatedMandiAgentRow = null;
    let updatedMandiUserRow = null;

    if (Object.keys(mandiAgentUpdates).length) {
      const [, updated] = await MandiAgent.update(mandiAgentUpdates, {
        where: { id: mandiUser.id },
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
    message: "Mandi Agent profile updated successfully.",
    data: result,
  };
};
