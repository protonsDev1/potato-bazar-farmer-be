import {
  creditWalletByAdmin,
  debitWalletByAdmin,
  fetchAdminTransactions,
  fetchUserBalance,
  fetchUserTransactions,
  fetchWalletDetailsForAdmin,
} from "../services/walletService";

export const adminCreditWallet = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    const adminId = req.user.id;

    const result = await creditWalletByAdmin(
      userId,
      amount,
      description,
      adminId,
    );

    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const adminDebitWallet = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    const adminId = req.user.id;

    const result = await debitWalletByAdmin(
      userId,
      amount,
      description,
      adminId,
    );

    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const getUserBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    const balance = await fetchUserBalance(userId);

    return res.json({ success: true, data: balance });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const getUserTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query;

    const result = await fetchUserTransactions(
      userId,
      Number(page),
      Number(limit),
    );

    return res.json({ success: true, ...result });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const adminGetWalletDetails = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const result = await fetchWalletDetailsForAdmin(userId);

    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const getAdminTransactions = async (req, res) => {
  try {
    const { page, limit, walletId, type } = req.query;

    const result = await fetchAdminTransactions(
      Number(page),
      Number(limit),
      walletId ? Number(walletId) : undefined,
      type ? String(type) : undefined,
    );

    return res.json({ success: true, ...result });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
