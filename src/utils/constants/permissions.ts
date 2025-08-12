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
