export const PERMISSIONS = {
  USER_MANAGEMENT: "user_management",
  MANDI_AGENTS: "mandi_agents",
  MANDI_LISTS: "mandi_list",
  KYC_REQUESTS: "kyc_requests",
  BUY_REQUESTS: "buy_requests",
  SELL_REQUESTS: "sell_requests",
  COLD_STORAGE: "cold_storage",
  GOVT_SCHEMES: "govt_schemes",
  EVENTS: "events",
  NEWS: "news",
  DIRECTORY: "directory",
  CONTENT_MANAGEMENT: "content_management",
  HELP_SUPPORT: "help_support",
  REPORTS: "reports",
} as const;

export type PermissionType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const WEB_MODULES = {
  FARMER: "farmer",
  TRADER: "trader",
  COLD_STORAGE: "coldStorage",
  AGENT: "agent",
  DROPDOWN_MANAGEMENT: "dropdownManagement",
} as const;

export const WEB_ACTIONS = {
  ADD_EDIT_MONTHLY_TARGET: "add_edit_monthly_target",
  ALL: "all",
  CREATE: "create",
  VIEW: "view",
  UPDATE: "update",
  DELETE: "delete",
  APPROVE_REJECT: "approve_reject",
} as const;

export const WEB_PERMISSIONS = {
  farmer: ["create", "view", "update", "delete", "approve_reject"],
  trader: ["create", "view", "update", "delete", "approve_reject"],
  coldStorage: ["create", "view", "update", "delete", "approve_reject"],
  agent: ["add_edit_monthly_target", "create", "view", "update", "delete"],
  dropdownManagement: ["all"],
} as const;

export const VALID_MODULES = Object.values(WEB_MODULES);
export const VALID_ACTIONS = Object.values(WEB_ACTIONS);
