import { WEB_PERMISSIONS } from "./constants/permissions";

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
