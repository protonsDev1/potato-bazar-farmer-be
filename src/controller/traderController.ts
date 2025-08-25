import ExcelJS from "exceljs";

import Trader from "../database/models/trader/trader";
import {
  addTradersToWorksheet,
  createTraderWorksheetColumns,
  getAllTraders,
  getTraderListByAdmin,
  onboardTrader,
  retrieveTraderProfile,
  softDeleteTraderById,
  updateTraderService,
} from "../services/traderService";
import { findUserByPkInDB, updateUserInDB } from "../services/userServices";
import { parseFilters } from "../utils/parseQuery";
import { verifyOtpFromDB } from "../services/otpServices";

export const createTrader = async (req, res) => {
  try {
    const userId = req.user.id;
    req.body.onBoardedBy = userId;

    const user = await findUserByPkInDB(userId);
    if (!user.success) {
      return res.status(400).json({ message: user.error });
    }

    await updateUserInDB(req.body.userId, { name: req.body.fullName });

    const trader = await onboardTrader(req.body);

    return res.status(201).json({ message: "Trader created", trader });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message || "Failed to create trader",
    });
  }
};

export const updateTrader = async (req, res) => {
  try {
    const { traderId } = req.params;
    const payload = req.body;
    const { role, id } = req.user;

    const trader = await Trader.findOne({
      where: { id: traderId, isDeleted: false },
    });
    if (!trader) return res.status(404).json({ message: "Trader not found" });

    if (role !== "admin" && role !== "agent") {
      return res.status(403).json({
        message:
          "Only Admins and Agents are authorized to update trader profiles.",
      });
    }

    if (role === "agent") {
      const isOnboardedByAgent = trader.onBoardedBy === id;
      const isWithin24Hours =
        Date.now() - new Date(trader.createdAt).getTime() <=
        24 * 60 * 60 * 1000;

      if (!isOnboardedByAgent || !isWithin24Hours) {
        return res.status(403).json({
          message:
            "Only Admins or the Agent who onboarded the trader within the last 24 hours can update the profile.",
        });
      }
    }

    if (payload.fullName) {
      await updateUserInDB(trader.userId, { name: payload.fullName });
    }

    const updatedTrader = await updateTraderService(traderId, payload);

    return res
      .status(200)
      .json({ message: "Trader updated successfully", trader: updatedTrader });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to update trader" });
  }
};

export const getTraderProfileOverview = async (req, res) => {
  try {
    const traderId = req.params.traderId;
    const { role, id: loggedInUserId } = req.user;

    const trader = await Trader.findOne({
      where: { id: traderId, isDeleted: false },
    });

    if (!trader) {
      return res.status(404).json({ message: "Trader not found." });
    }

    if (role !== "admin" && trader.onBoardedBy !== loggedInUserId) {
      return res.status(403).json({
        message:
          "Only Admins or Agents who onboarded the trader are authorized to view this profile.",
      });
    }

    let isWithin24Hours = true;

    if (role === "agent") {
      isWithin24Hours =
        Date.now() - new Date(trader.createdAt).getTime() <=
        24 * 60 * 60 * 1000;
    }

    const traderData = await retrieveTraderProfile(traderId, isWithin24Hours);

    return res
      .status(200)
      .json({ message: "Fetched trader profile overview", trader: traderData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to retrieve trader profile." });
  }
};

export const selfOnboardedTrader = async (req, res) => {
  try {
    const userId = req.body.userId;
    req.body.onBoardedBy = userId;

    const user = await findUserByPkInDB(userId);
    if (!user.success) {
      return res.status(400).json({ message: user.error });
    }

    await updateUserInDB(req.body.userId, { name: req.body.fullName });

    const trader = await onboardTrader(req.body);

    return res
      .status(201)
      .json({ message: "Trader self onboarded successfully.", trader });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to self onboard trader",
    });
  }
};

export const getTraderList = async (req, res) => {
  try {
    const { page, perPage, search } = req.query;

    const filters = parseFilters(req.query);

    const traderList = await getTraderListByAdmin(
      page,
      perPage,
      filters,
      search
    );

    return res.status(200).json({
      message: "Trader List",
      data: traderList,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to get Trader List" });
  }
};

export const deleteTrader = async (req, res) => {
  try {
    const result = await softDeleteTraderById(req.params.id);
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }

    return res
      .status(200)
      .json({ success: true, message: "Trader deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Failed to delete trader",
    });
  }
};

export const exportTraders = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const isValid = await verifyOtpFromDB(mobile, otp);
    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    const filters = parseFilters(req.query);
    const search = req.query.search || "";
    const traders = await getAllTraders(filters, search);

    if (!traders.length) {
      return res.status(404).json({ message: "No traders found." });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Traders");

    createTraderWorksheetColumns(worksheet);
    await addTradersToWorksheet(traders, worksheet);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=traders.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Trader export error:", error);
    res
      .status(500)
      .json({ message: "Failed to export traders", error: error.message });
  }
};
