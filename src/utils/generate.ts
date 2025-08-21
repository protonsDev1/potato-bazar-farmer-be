import crypto, { randomUUID } from "crypto";
import ColdStorageRequirement from "../database/models/coldStorageRequirement";

export const generateRandomPassword = (length = 10): string => {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
};

export const generateAgentId = (): string => {
  return "AG" + Math.random().toString(36).substr(2, 6).toUpperCase(); // e.g., AG4F9ZK
};

export const generateUniqueRequirementUid = async () => {
  const requirementCode = Math.floor(10000000 + Math.random() * 90000000);

  const requirement = await ColdStorageRequirement.findOne({
    where: { requirementUid: requirementCode.toString() },
  });

  if (requirement) {
    return await generateUniqueRequirementUid();
  }

  return requirementCode.toString();
};

export const generateBuyRequestId = (): string => {
  return `BUY-${Date.now().toString().slice(-5)}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
};

export const generateSellRequestId = (): string => {
  return `SELL-${Date.now().toString().slice(-5)}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
};
