import { Op } from "sequelize";

import User, { USER_ROLES } from "../database/models/user";
import { WEB_PERMISSIONS } from "../utils/constants/permissions";
import SubAdminWebPermission from "../database/models/subAdminWebPermission";

interface PrivilegePayload {
  module: string;
  actions: string[];
}

interface CreateSubAdminWebPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
  privileges?: PrivilegePayload[];
}

export const createSubAdminWebService = async (
  payload: CreateSubAdminWebPayload
) => {
  const { name, email, mobile, password, privileges } = payload;

  const existingEmailUser = await User.findOne({ where: { email } });
  if (existingEmailUser) {
    return { success: false, statusCode: 409, message: "Email already exists" };
  }

  const existingMobileUser = await User.findOne({ where: { mobile } });
  if (existingMobileUser) {
    return {
      success: false,
      statusCode: 409,
      message: "Mobile already exists",
    };
  }

  const subAdminWeb = await User.create({
    name,
    email,
    mobile,
    password,
    role: USER_ROLES.SUB_ADMIN_WEB,
  });

  if (Array.isArray(privileges) && privileges.length > 0) {
    for (const permission of privileges) {
      const { module, actions } = permission;

      // Only create records if actions array is non-empty
      if (actions && actions.length > 0) {
        const records = actions.map((action) => ({
          userId: subAdminWeb.id,
          module,
          action,
        }));
        await SubAdminWebPermission.bulkCreate(records, {
          ignoreDuplicates: true,
        });
      }
    }
  }
  return {
    success: true,
    statusCode: 201,
    message: "Sub admin web created",
    data: subAdminWeb,
  };
};

export const listSubAdminWebsService = async ({ search, page, limit }) => {
  const whereClause: any = { role: USER_ROLES.SUB_ADMIN_WEB };

  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const offset = (page - 1) * limit;
  const totalPermissions = Object.values(WEB_PERMISSIONS).reduce(
    (sum, actions) => sum + actions.length,
    0
  );

  const { rows, count } = await User.findAndCountAll({
    where: whereClause,
    attributes: { exclude: ["password_hash"] },
    include: [
      {
        model: SubAdminWebPermission,
        attributes: ["id", "module", "action"],
        as: "webPermissions",
      },
    ],
    distinct: true,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  const subAdmins = rows.map((subAdmin) => {
    const permissionCount = subAdmin.webPermissions?.length || 0;

    const sortedPermissions = (subAdmin.webPermissions || [])
      .slice()
      .sort((a, b) => {
        // Compare by module first
        if (a.module.toLowerCase() < b.module.toLowerCase()) return -1;
        if (a.module.toLowerCase() > b.module.toLowerCase()) return 1;

        // If same module, compare by action
        if (a.action.toLowerCase() < b.action.toLowerCase()) return -1;
        if (a.action.toLowerCase() > b.action.toLowerCase()) return 1;
        return 0;
      });

    return {
      ...subAdmin.toJSON(),
      webPermissions: sortedPermissions,
      permissionCount,
      totalPermissions,
    };
  });

  const [recentAdditions, activeCount, totalSubAdmins] = await Promise.all([
    User.count({
      where: {
        role: USER_ROLES.SUB_ADMIN_WEB,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
        },
      },
    }),

    User.count({
      where: {
        role: USER_ROLES.SUB_ADMIN_WEB,
        isActive: true,
      },
    }),

    User.count({
      where: { role: USER_ROLES.SUB_ADMIN_WEB },
    }),
  ]);

  return {
    success: true,
    statusCode: 200,
    message: "Sub admin webs fetched successfully",
    data: {
      total: count,
      page,
      perPage: limit,
      totalPages: Math.ceil(count / limit),
      totalSubAdmins,
      activeCount,
      recentAdditions,
      subAdmins: subAdmins,
    },
  };
};

export const updateSubAdminWebService = async (id, payload) => {
  const { privileges, ...updateFields } = payload;

  const subAdmin = await User.findOne({
    where: { id, role: USER_ROLES.SUB_ADMIN_WEB },
  });

  if (!subAdmin) {
    return {
      success: false,
      statusCode: 404,
      message: "Sub admin web not found",
    };
  }

  if (updateFields.email) {
    const existingEmailUser = await User.findOne({
      where: { email: updateFields.email, id: { [Op.ne]: id } },
    });
    if (existingEmailUser) {
      return {
        success: false,
        statusCode: 409,
        message: "Email already exists",
      };
    }
  }

  if (updateFields.mobile) {
    const existingMobileUser = await User.findOne({
      where: { mobile: updateFields.mobile, id: { [Op.ne]: id } },
    });
    if (existingMobileUser) {
      return {
        success: false,
        statusCode: 409,
        message: "Mobile already exists",
      };
    }
  }

  await subAdmin.update(updateFields);

  if (Array.isArray(privileges) && privileges.length > 0) {
    for (const permission of privileges) {
      const { module, actions } = permission;

      if (!actions || actions.length === 0) {
        // Remove all actions for this module
        await SubAdminWebPermission.destroy({
          where: { userId: id, module },
        });
      } else {
        // Get existing actions for this module
        const existing = await SubAdminWebPermission.findAll({
          where: { userId: id, module },
        });

        const existingActions = existing.map((p) => p.action);

        // Determine which actions to add
        const actionsToAdd = actions.filter(
          (action) => !existingActions.includes(action)
        );

        // Determine which actions to remove
        const actionsToRemove = existingActions.filter(
          (action) => !actions.includes(action)
        );

        if (actionsToRemove.length > 0) {
          await SubAdminWebPermission.destroy({
            where: { userId: id, module, action: actionsToRemove },
          });
        }

        // Add new actions
        if (actionsToAdd.length > 0) {
          const records = actionsToAdd.map((action) => ({
            userId: id,
            module,
            action,
          }));
          await SubAdminWebPermission.bulkCreate(records);
        }
      }
    }
  }

  return {
    success: true,
    statusCode: 200,
    message: "Sub admin web updated",
    data: subAdmin,
  };
};

export const getSubAdminWebByIdService = async (id: number) => {
  const subAdmin = await User.findOne({
    where: { id, role: USER_ROLES.SUB_ADMIN_WEB },
    attributes: { exclude: ["password_hash"] },
    include: [
      {
        model: SubAdminWebPermission,
        as: "webPermissions",
        attributes: ["module", "action"],
      },
    ],
  });

  if (!subAdmin) {
    return {
      success: false,
      statusCode: 404,
      message: "Sub admin web not found",
    };
  }

  const allModulePermissions = Object.entries(WEB_PERMISSIONS).map(
    ([module, actions]) => ({
      module,
      actions,
    })
  );

  const assignedPermissions = subAdmin.webPermissions.map(
    (p) => `${p.module.toLowerCase()}:${p.action.toLowerCase()}`
  );

  const permissionsWithStatus = allModulePermissions.map(
    ({ module, actions }) => ({
      module,
      actions: actions.map((action) => ({
        name: action,
        assigned: assignedPermissions.includes(
          `${module.toLowerCase()}:${action.toLowerCase()}`
        ),
      })),
    })
  );
  return {
    success: true,
    statusCode: 200,
    message: "Sub admin web details fetched successfully",
    data: {
      ...subAdmin.toJSON(),
      permissionsByModule: permissionsWithStatus,
    },
  };
};

export const deleteSubAdminWebService = async (id) => {
  const subAdmin = await User.findOne({
    where: { id, role: USER_ROLES.SUB_ADMIN_WEB },
  });
  if (!subAdmin) {
    return {
      success: false,
      statusCode: 404,
      message: "Sub admin web not found",
    };
  }

  await SubAdminWebPermission.destroy({ where: { userId: id } });
  await subAdmin.destroy();

  return { success: true, statusCode: 200, message: "Sub admin web deleted" };
};
