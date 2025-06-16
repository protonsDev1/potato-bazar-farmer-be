import { onboardTrader } from "../services/traderService";
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
