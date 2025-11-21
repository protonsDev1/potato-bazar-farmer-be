import SubAdminPermission from "../database/models/subAdminPermission";
import { USER_ROLES } from "../database/models/user";
import { PERMISSIONS, WEB_PERMISSIONS } from "./constants/permissions";

export function buildPermissionsResponse(allowed: string[]) {
  const response: any = {};

  for (const [role, actions] of Object.entries(WEB_PERMISSIONS)) {
    response[role] = {};
    actions.forEach((action) => {
      const key = `${role}:${action}`;
      response[role][action] = allowed.includes(key);
    });
  }

  return response;
}

export function buildSubAdminPermissionsResponse(allowed: string[]) {
  const response: any = {};

  for (const [key, value] of Object.entries(PERMISSIONS)) {
    response[value] = allowed.includes(value);
  }

  return response;
}

export const canUpdateResource = async (
  user: any,
  resourceOwnerId: number,
  requiredPermission?: string
): Promise<boolean> => {
  if (!user) return false;

  // Owner
  if (resourceOwnerId === user.id) return true;

  // Super admin
  if (user.role === USER_ROLES.SUPER_ADMIN) return true;

  // Sub-admin must have explicit permission
  if (user.role === USER_ROLES.SUB_ADMIN) {
    if (!requiredPermission) return false;
    const exists = await SubAdminPermission.findOne({
      where: { userId: user.id, permission: requiredPermission },
    });
    return !!exists;
  }

  // All other roles - not allowed
  return false;
};
