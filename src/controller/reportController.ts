import ExcelJS from "exceljs";
import { getMobileUsersReportData } from "../services/reportService";

export const exportMobileUsersReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const rows: any[] = await getMobileUsersReportData(
      startDate as string,
      endDate as string
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Mobile Users Report");

    // Define columns matching the SQL aliases
    worksheet.columns = [
      { header: "User ID", key: "User ID", width: 10 },
      { header: "Name", key: "Name", width: 25 },
      { header: "Mobile", key: "Mobile", width: 18 },
      { header: "Registration Date", key: "Registration Date", width: 22 },
      { header: "State", key: "State", width: 20 },
      { header: "District", key: "District", width: 20 },
      { header: "Location", key: "Location", width: 25 },
      { header: "UserType", key: "UserType", width: 15 },
      { header: "KYC Status", key: "KYC Status", width: 15 },
      { header: "Device", key: "Device", width: 12 },
      { header: "Active Status", key: "Active Status", width: 15 },
      { header: "Last Login Date", key: "Last Login Date", width: 22 },
    ];

    // Style header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    // Add data rows
    rows.forEach((row) => {
      worksheet.addRow({
        "User ID": row["User ID"],
        "Name": row["Name"] || "",
        "Mobile": row["Mobile"] || "",
        "Registration Date": row["Registration Date"]
          ? new Date(row["Registration Date"]).toISOString().split("T")[0]
          : "",
        "State": row["State"] || "",
        "District": row["District"] || "",
        "Location": row["Location"] || "",
        "UserType": row["UserType"] || "",
        "KYC Status": row["KYC Status"] || "",
        "Device": row["Device"] || "",
        "Active Status":
          row["Active Status"] === true
            ? "Active"
            : row["Active Status"] === false
            ? "Inactive"
            : "",
        "Last Login Date": row["Last Login Date"]
          ? new Date(row["Last Login Date"]).toISOString().split("T")[0]
          : "",
      });
    });

    // Set response headers for Excel download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=mobile_users_report.xlsx"
    );

    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    console.error("Error exporting mobile users report:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to export mobile users report",
      error: error.message,
    });
  }
};
