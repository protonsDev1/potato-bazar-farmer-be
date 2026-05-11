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
      "lastLogin" AS "Last Login Date"
    FROM public.users
    WHERE ${conditions.join(" AND ")};
  `;

  const results = await sequelize.query(query, {
    type: QueryTypes.SELECT,
    replacements,
  });

  return results;
};
