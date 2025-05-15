import crypto from 'crypto';

export const generateRandomPassword = (length = 10): string => {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
};

export const generateAgentId = (): string => {
  return 'AG' + Math.random().toString(36).substr(2, 6).toUpperCase(); // e.g., AG4F9ZK
};
