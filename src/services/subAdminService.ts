import User, { USER_ROLES } from "../database/models/user";
import SubAdminPermission from "../database/models/subAdminPermission";
import { Op } from "sequelize";
import { PERMISSIONS } from "../utils/constants/permissions";

interface CreateSubAdminPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
  privileges?: string[];
}

export const createSubAdminService = async (payload: CreateSubAdminPayload) => {
  const { name, email, mobile, password, privileges } = payload;

  const existingEmailUser = await User.findOne({ where: { email } });
  if (existingEmailUser) {
    return { success: false, statusCode: 409, message: "Email already exists" };
  }

  if (mobile) {
    const isMobileTaken = await User.findOne({ where: { mobile } });
    if (isMobileTaken) {
      return {
        success: false,
        statusCode: 409,
        message: "Mobile number already exists.",
      };
    }
  }

  const subAdmin = await User.create({
    name,
    email,
    password,
    role: USER_ROLES.SUB_ADMIN,
  });

  if (Array.isArray(privileges) && privileges.length > 0) {
    const permissionRecords = privileges.map((p) => ({
      userId: subAdmin.id,
      permission: p,
    }));
    await SubAdminPermission.bulkCreate(permissionRecords);
  }

  return {
    success: true,
    statusCode: 201,
    message: "Sub admin created",
    data: subAdmin,
  };
};

export const listSubAdminsService = async ({ search, page, limit }) => {
  const whereClause: any = { role: USER_ROLES.SUB_ADMIN };

  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const offset = (page - 1) * limit;
  const totalPermissions = Object.keys(PERMISSIONS).length;

  const { rows, count } = await User.findAndCountAll({
    where: whereClause,
    attributes: { exclude: ["password_hash"] },
    include: [
      {
        model: SubAdminPermission,
        attributes: ["id", "permission"],
        as: "permissions",
      },
    ],
    distinct: true,
    offset,
    limit,
    order: [["updatedAt", "DESC"]],
  });

  const subAdmins = rows.map((subAdmin) => {
    const permissionCount = subAdmin.permissions?.length || 0;
    return {
      ...subAdmin.toJSON(),
      permissionCount,
      totalPermissions,
    };
  });

  const [recentAdditions, activeCount, totalSubAdmins] = await Promise.all([
    User.count({
      where: {
        role: USER_ROLES.SUB_ADMIN,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
        },
      },
    }),

    User.count({
      where: {
        role: USER_ROLES.SUB_ADMIN,
        isActive: true,
      },
    }),

    User.count({
      where: { role: USER_ROLES.SUB_ADMIN },
    }),
  ]);

  return {
    success: true,
    statusCode: 200,
    message: "Sub admins fetched successfully",
    data: {
      total: count,
      page,
      perPage: limit,
      totalSubAdmins,
      activeCount,
      recentAdditions,
      subAdmins: subAdmins,
    },
  };
};

export const updateSubAdminService = async (id, payload) => {
  const { privileges, ...updateFieldsRaw } = payload;
  const updateFields = { ...updateFieldsRaw };

  const subAdmin = await User.findOne({
    where: { id, role: USER_ROLES.SUB_ADMIN },
  });
  if (!subAdmin) {
    return { success: false, statusCode: 404, message: "Sub admin not found" };
  }

  if (updateFields.email) {
    const isEmailTaken = await User.findOne({
      where: { email: updateFields.email, id: { [Op.ne]: id } },
    });
    if (isEmailTaken) {
      return {
        success: false,
        statusCode: 409,
        message: "Email already exists.",
      };
    }
  }

  if (updateFields.mobile) {
    const isMobileTaken = await User.findOne({
      where: { mobile: updateFields.mobile, id: { [Op.ne]: id } },
    });
    if (isMobileTaken) {
      return {
        success: false,
        statusCode: 409,
        message: "Mobile number already exists.",
      };
    }
  }

  await subAdmin.update(updateFields);

  if (Array.isArray(privileges)) {
    await SubAdminPermission.destroy({ where: { userId: id } });

    if (privileges.length > 0) {
      const permissionRecords = privileges.map((p) => ({
        userId: id,
        permission: p,
      }));
      await SubAdminPermission.bulkCreate(permissionRecords);
    }
  }

  return {
    success: true,
    statusCode: 200,
    message: "Sub admin updated",
    data: subAdmin,
  };
};

export const getSubAdminByIdService = async (id: number) => {
  const allPermissions = Object.values(PERMISSIONS);

  const subAdmin = await User.findOne({
    where: { id, role: USER_ROLES.SUB_ADMIN },
    attributes: { exclude: ["password_hash"] },
    include: [
      {
        model: SubAdminPermission,
        as: "permissions",
      },
    ],
  });

  if (!subAdmin) {
    return {
      success: false,
      statusCode: 404,
      message: "Sub admin not found",
    };
  }

  const assignedPermissions = subAdmin.permissions.map((p) => p.permission);

  const permissionsWithStatus = allPermissions.map((perm) => ({
    name: perm,
    assigned: assignedPermissions.includes(perm),
  }));

  return {
    success: true,
    statusCode: 200,
    message: "Sub admin details fetched successfully",
    data: {
      ...subAdmin.toJSON(),
      permissions: permissionsWithStatus,
    },
  };
};

export const deleteSubAdminService = async (id) => {
  const subAdmin = await User.findOne({
    where: { id, role: USER_ROLES.SUB_ADMIN },
  });
  if (!subAdmin) {
    return { success: false, statusCode: 404, message: "Sub admin not found" };
  }

  await SubAdminPermission.destroy({ where: { userId: id } });
  await subAdmin.destroy();

  return { success: true, statusCode: 200, message: "Sub admin deleted" };
};
