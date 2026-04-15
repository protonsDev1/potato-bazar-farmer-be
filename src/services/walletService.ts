import sequelize from "../database/models/db";
import User, { USER_ROLES } from "../database/models/user";
import Wallet from "../database/models/wallet";
import WalletTransaction, {
  USAGE_TYPE,
} from "../database/models/walletTransaction";

export const creditWalletByAdmin = async (
  userId: number,
  amount: number,
  description: string,
  adminId: number,
) => {
  return sequelize.transaction(async (t) => {
    let wallet = await Wallet.findOne({
      where: { userId },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    // Create wallet if not exists
    if (!wallet) {
      wallet = await Wallet.create(
        {
          userId,
          userBalance: 0,
          adminBalance: 0,
          balance: 0,
        },
        { transaction: t },
      );
    }

    const adminBalance = Number(wallet.adminBalance) + Number(amount);
    const userBalance = Number(wallet.userBalance);

    wallet.adminBalance = adminBalance;
    wallet.balance = adminBalance + userBalance;

    await wallet.save({ transaction: t });

    await WalletTransaction.create(
      {
        walletId: wallet.id,
        createdBy: adminId,
        amount,
        type: "credit",
        source: "admin",
        usageType: USAGE_TYPE.ADMIN_CREDIT,
        referenceId: null,
        description,
      },
      { transaction: t },
    );

    return wallet;
  });
};

export const debitWalletByAdmin = async (
  userId: number,
  amount: number,
  description: string,
  adminId: number,
) => {
  return sequelize.transaction(async (t) => {
    let wallet = await Wallet.findOne({
      where: { userId },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!wallet) {
      return {
        success: false,
        message: "Wallet not found",
      };
    }

    const adminBalance = Number(wallet.adminBalance);

    if (adminBalance < Number(amount)) {
      return {
        success: false,
        message: "Insufficient admin balance",
      };
    }

    wallet.adminBalance = adminBalance - Number(amount);
    wallet.balance = Number(wallet.adminBalance) + Number(wallet.userBalance);

    await wallet.save({ transaction: t });

    await WalletTransaction.create(
      {
        walletId: wallet.id,
        createdBy: adminId,
        amount,
        type: "debit",
        source: "admin",
        usageType: USAGE_TYPE.ADMIN_DEBIT,
        referenceId: null,
        description,
      },
      { transaction: t },
    );

    return {
      success: true,
      data: wallet,
    };
  });
};

export const fetchUserBalance = async (userId: number) => {
  let wallet = await Wallet.findOne({ where: { userId } });

  // Auto-create wallet if not exists
  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      balance: 0,
      userBalance: 0,
      adminBalance: 0,
      status: "active",
    });
  }

  return {
    balance: Number(wallet.balance),
    userBalance: Number(wallet.userBalance),
    adminBalance: Number(wallet.adminBalance),
  };
};

export const fetchUserTransactions = async (
  userId: number,
  page = 1,
  limit = 10,
) => {
  const wallet = await Wallet.findOne({ where: { userId } });
  if (!wallet) throw new Error("Wallet not found");

  const offset = (page - 1) * limit;

  const { rows, count } = await WalletTransaction.findAndCountAll({
    where: { walletId: wallet.id },
    order: [["createdAt", "DESC"]],
    offset,
    limit,
  });

  return {
    total: count,
    page,
    limit,
    transactions: rows,
  };
};

export const fetchWalletDetailsForAdmin = async (userId: number) => {
  const wallet = await Wallet.findOne({
    where: { userId },
    include: [
      {
        model: WalletTransaction,
        as: "transactions",
        order: [["createdAt", "DESC"]],
      },
    ],
  });

  if (!wallet) throw new Error("Wallet not found");

  return wallet;
};

export const fetchAdminTransactions = async (
  page = 1,
  limit = 10,
  walletId?: number,
  type?: string,
) => {
  const offset = (page - 1) * limit;

  const whereCondition: any = {};

  if (walletId) {
    whereCondition.walletId = walletId;
  }

  if (type && type !== "all") {
    whereCondition.type = type; // "credit" or "debit"
  }

  const { rows, count } = await WalletTransaction.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "name", "role", "email", "mobile"],
        where: {
          role: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SUB_ADMIN],
        },
      },
      {
        model: Wallet,
        as: "wallet",
        attributes: ["id", "balance"],
        include: [
          {
            model: User,
            as: "user",
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
    offset,
    limit,
  });

  return {
    total: count,
    page,
    limit,
    transactions: rows,
  };
};
