export const PERMISSIONS = {
  USER_MANAGEMENT: "user_management",
  MANDI_AGENTS: "mandi_agents",
  KYC_REQUESTS: "kyc_requests",
  BUY_REQUESTS: "buy_requests",
  SELL_REQUESTS: "sell_requests",
  COLD_STORAGE: "cold_storage",
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
  ALL: "all",
  CREATE: "create",
  VIEW: "view",
  UPDATE: "update",
  DELETE: "delete",
  REVIEW: "review",
} as const;

export const WEB_PERMISSIONS = {
  farmer: ["create", "view", "update", "delete", "review"],
  trader: ["create", "view", "update", "delete", "review"],
  coldStorage: ["create", "view", "update", "delete", "review"],
  agent: ["create", "view", "update", "delete"],
  dropdownManagement: ["all"],
} as const;

export const VALID_MODULES = Object.values(WEB_MODULES);
export const VALID_ACTIONS = Object.values(WEB_ACTIONS);
