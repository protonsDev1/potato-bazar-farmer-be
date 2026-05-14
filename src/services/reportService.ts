import sequelize from "../database/models/db";
import { QueryTypes } from "sequelize";

export const getMobileUsersReportData = async (
  startDate?: string,
  endDate?: string
) => {
  const conditions: string[] = [
    `("isUserOnBoardedOnMobile" = true OR "hasStartedUsingMobile" = true)`,
  ];
  const replacements: any = {};

  if (startDate) {
    conditions.push(`"createdAt" >= :startDate`);
    replacements.startDate = new Date(startDate);
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    conditions.push(`"createdAt" <= :endDate`);
    replacements.endDate = end;
  }

  const query = `
    SELECT
      id AS "User ID",
      name AS "Name",
      mobile AS "Mobile",
      "createdAt" AS "Registration Date",
      state AS "State",
      district AS "District",
      location AS "Location",
      "userType" AS "UserType",
      CASE
        WHEN "pbVerificationStatus" = 'approved' THEN 'Verified'
        WHEN "pbVerificationStatus" = 'pending' THEN 'Pending'
        ELSE 'Pending'
      END AS "KYC Status",
      "deviceType" AS "Device",
      "isActive" AS "Active Status",
      "lastLogin" AS "Last Login Date",
      (
        EXISTS (SELECT 1 FROM "buyRequests" b WHERE b."userId" = public.users.id) OR
        EXISTS (SELECT 1 FROM "sellRequests" s WHERE s."userId" = public.users.id) OR
        EXISTS (SELECT 1 FROM "coldStorages" c WHERE c."userId" = public.users.id) OR
        EXISTS (SELECT 1 FROM "coldStorageRequirements" cr WHERE cr."createdBy" = public.users.id)
      ) AS "isListing",
      (
        name IS NULL OR name = '' OR 
        state IS NULL OR state = '' OR 
        district IS NULL OR district = '' OR 
        location IS NULL OR location = ''
      ) AS "isIncompleteProfile",
      (
        NOT EXISTS (SELECT 1 FROM "contactSupport" cs WHERE cs."userId" = public.users.id)
      ) AS "isWithNoEnquiry"
    FROM public.users
    WHERE ${conditions.join(" AND ")};
  `;

  const results = await sequelize.query(query, {
    type: QueryTypes.SELECT,
    replacements,
  });

  return results;
};

export const getMobileUsersReportSummary = async (
  startDate?: string,
  endDate?: string
) => {
  const replacements: any = {};
  let dateCondition = "";

  if (startDate) {
    dateCondition += ` AND "createdAt" >= :startDate`;
    replacements.startDate = new Date(startDate);
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    dateCondition += ` AND "createdAt" <= :endDate`;
    replacements.endDate = end;
  }

  const query = `
    SELECT
      (SELECT COUNT(id) FROM users WHERE ("isUserOnBoardedOnMobile" = true OR "hasStartedUsingMobile" = true) ${dateCondition}) AS "totalUsers",
      
      (SELECT COUNT(id) FROM users WHERE ("isUserOnBoardedOnMobile" = true OR "hasStartedUsingMobile" = true) 
        AND "lastLogin" IS NOT NULL 
        ${dateCondition.replace(/"createdAt"/g, '"lastLogin"')}) AS "usersWithLastLogin",

      (SELECT COUNT(u.id) FROM users u 
        WHERE (u."isUserOnBoardedOnMobile" = true OR u."hasStartedUsingMobile" = true) 
        ${dateCondition.replace(/"createdAt"/g, 'u."createdAt"')}
        AND NOT EXISTS (SELECT 1 FROM "buyRequests" b WHERE b."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "sellRequests" s WHERE s."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "coldStorages" c WHERE c."userId" = u.id)
        AND NOT EXISTS (SELECT 1 FROM "coldStorageRequirements" cr WHERE cr."createdBy" = u.id)
      ) AS "usersWithNoListings",

      (SELECT COUNT(id) FROM users WHERE ("isUserOnBoardedOnMobile" = true OR "hasStartedUsingMobile" = true) 
        ${dateCondition}
        AND (name IS NULL OR name = '' OR state IS NULL OR state = '' OR district IS NULL OR district = '' OR location IS NULL OR location = '')
      ) AS "usersWithIncompleteProfiles",

      (SELECT COUNT(u.id) FROM users u 
        WHERE (u."isUserOnBoardedOnMobile" = true OR u."hasStartedUsingMobile" = true) 
        ${dateCondition.replace(/"createdAt"/g, 'u."createdAt"')}
        AND NOT EXISTS (SELECT 1 FROM "contactSupport" cs WHERE cs."userId" = u.id)
      ) AS "usersWithNoEnquiry"
  `;

  const results = await sequelize.query(query, {
    type: QueryTypes.SELECT,
    replacements,
  });

  return results[0];
};
