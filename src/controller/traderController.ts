import Trader from "../database/models/trader/trader";
import {
  onboardTrader,
  retrieveTraderProfile,
} from "../services/traderService";
import { updateUserInDB } from "../services/userServices";

export const createTrader = async (req, res) => {
  try {
    const userId = req.user.id;
    req.body.onBoardedBy = userId;

    await updateUserInDB(req.body.userId, { name: req.body.fullName });

    const trader = await onboardTrader(req.body);

    return res.status(201).json({ message: "Trader created", trader });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message || "Failed to create trader",
    });
  }
};

export const getTraderProfileOverview = async (req, res) => {
  try {
    const traderId = req.params.traderId;
    const { role, id: loggedInUserId } = req.user;

    const trader = await Trader.findOne({ where: { id: traderId } });

    if (!trader) {
      return res.status(404).json({ message: "Trader not found." });
    }

    if (role !== "admin" && trader.onBoardedBy !== loggedInUserId) {
      return res.status(403).json({
        message:
          "Only Admins or Agents who onboarded the trader are authorized to view this profile.",
      });
    }

    const traderData = await retrieveTraderProfile(traderId);

    return res
      .status(200)
      .json({ message: "Fetched trader profile overview", trader: traderData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to retrieve trader profile." });
  }
};
