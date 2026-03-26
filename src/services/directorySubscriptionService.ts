import sequelize from "../database/models/db";
import UserDirectorySubscription from "../database/models/userDirectorySubscription";
import Wallet from "../database/models/wallet";
import WalletTransaction, {
  USAGE_TYPE,
} from "../database/models/walletTransaction";
import DirectorySubscriptionPlan from "../database/models/directorySubscriptionPlan";
import { Op } from "sequelize";

// ✅ Create Plan
export const createPlan = async (data) => {
  try {
    const plan = await DirectorySubscriptionPlan.create(data);

    return {
      success: true,
      message: "Plan created successfully",
      statusCode: 201,
      data: plan,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "Failed to create plan",
      statusCode: 400,
    };
  }
};

// ✅ Update Plan
export const updatePlan = async (id, data) => {
  try {
    const plan = await DirectorySubscriptionPlan.findByPk(id);

    if (!plan) {
      return {
        success: false,
        message: "Plan not found",
        statusCode: 404,
      };
    }

    await plan.update(data);

    return {
      success: true,
      message: "Plan updated successfully",
      statusCode: 200,
      data: plan,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "Failed to update plan",
      statusCode: 400,
    };
  }
};

// ✅ List Plans
export const getPlans = async (filters: any = {}) => {
  try {
    const where: any = {};

    // ✅ Apply isActive filter if passed
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const plans = await DirectorySubscriptionPlan.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return {
      success: true,
      message: "Plans fetched successfully",
      statusCode: 200,
      data: plans,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "Failed to fetch plans",
      statusCode: 400,
    };
  }
};

// ✅ Get Plan by ID
export const getPlanById = async (id) => {
  try {
    const plan = await DirectorySubscriptionPlan.findByPk(id);

    if (!plan) {
      return {
        success: false,
        message: "Plan not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Plan fetched successfully",
      statusCode: 200,
      data: plan,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "Failed to fetch plan",
      statusCode: 400,
    };
  }
};

// ✅ Get Current Subscription
export const getMySubscription = async (userId: number) => {
  try {
    const now = new Date();

    const subscription = await UserDirectorySubscription.findOne({
      where: {
        userId,
        status: "active",
        endDate: {
          [Op.gt]: now, // only non-expired
        },
      },
      include: [
        {
          model: DirectorySubscriptionPlan,
          as: "plan",
        },
      ],
    });

    return {
      success: true,
      message: "Subscription fetched successfully",
      statusCode: 200,
      data: subscription,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "Failed to fetch subscription",
      statusCode: 400,
    };
  }
};

// 🔥 Buy Plan
export const buyPlan = async (userId: number, planId: number) => {
  const transaction = await sequelize.transaction();

  try {
    const now = new Date();

    // 🔒 Fetch plan
    const plan = await DirectorySubscriptionPlan.findByPk(planId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!plan) {
      await transaction.rollback();
      return {
        success: false,
        message: "Plan not found",
        statusCode: 404,
      };
    }

    if (!plan.isActive) {
      await transaction.rollback();
      return {
        success: false,
        message: "Plan is inactive",
        statusCode: 400,
      };
    }

    // 🔒 Fetch wallet
    const wallet = await Wallet.findOne({
      where: { userId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!wallet) {
      await transaction.rollback();
      return {
        success: false,
        message: "Wallet not found",
        statusCode: 404,
      };
    }

    const price = parseFloat(plan.price as any);

    if (parseFloat(wallet.balance as any) < price) {
      await transaction.rollback();
      return {
        success: false,
        message: "Insufficient wallet balance",
        wallet,
        statusCode: 400,
      };
    }

    // 🔍 Get current subscription (ACTIVE + NOT EXPIRED)
    const existing = await UserDirectorySubscription.findOne({
      where: {
        userId,
        status: "active",
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    let subscription;
    let actionType = "purchase";

    // 💰 Deduct wallet (common logic)
    let remaining = price;

    let userBalance = parseFloat(wallet.userBalance as any);
    let adminBalance = parseFloat(wallet.adminBalance as any);

    if (userBalance >= remaining) {
      userBalance -= remaining;
      remaining = 0;
    } else {
      remaining -= userBalance;
      userBalance = 0;

      if (adminBalance < remaining) {
        await transaction.rollback();
        return {
          success: false,
          message: "Insufficient balance",
          statusCode: 400,
        };
      }

      adminBalance -= remaining;
    }

    wallet.userBalance = userBalance;
    wallet.adminBalance = adminBalance;
    wallet.balance = userBalance + adminBalance;

    await wallet.save({ transaction });

    // 🔥 MAIN LOGIC
    if (existing) {
      const isExpired = !existing.endDate || new Date(existing.endDate) <= now;

      // =========================
      // 🔥 CASE 1: SAME PLAN
      // =========================
      if (existing.planId === plan.id) {
        actionType = "renewal";

        let baseDate =
          !isExpired && existing.endDate ? new Date(existing.endDate) : now;

        const newEndDate = new Date(baseDate);
        newEndDate.setMonth(newEndDate.getMonth() + plan.durationInMonths);

        existing.endDate = newEndDate;
        existing.status = "active";

        await existing.save({ transaction });

        subscription = existing;
      }

      // =========================
      // 🔥 CASE 2: DIFFERENT PLAN (UPGRADE)
      // =========================
      else {
        actionType = "upgrade";

        const startDate = now;
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + plan.durationInMonths);

        existing.planId = plan.id;
        existing.startDate = startDate;
        existing.endDate = endDate;
        existing.status = "active";

        await existing.save({ transaction });

        subscription = existing;
      }
    }

    // =========================
    // 🆕 NO EXISTING PLAN
    // =========================
    else {
      const startDate = now;
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.durationInMonths);

      subscription = await UserDirectorySubscription.create(
        {
          userId,
          planId,
          startDate,
          endDate,
          status: "active",
        },
        { transaction },
      );
    }

    // 💸 Wallet Transaction
    await WalletTransaction.create(
      {
        walletId: wallet.id,
        createdBy: userId,
        amount: price,
        type: "debit",
        source: "system",
        usageType: USAGE_TYPE.DIRECTORY_SUBSCRIPTION,
        referenceId: plan.id,
        description: `Directory subscription ${actionType}`,
      },
      { transaction },
    );

    await transaction.commit();

    return {
      success: true,
      message:
        actionType === "upgrade"
          ? "Subscription upgraded successfully"
          : actionType === "renewal"
            ? "Subscription renewed successfully"
            : "Subscription purchased successfully",
      statusCode: 200,
      data: subscription,
    };
  } catch (err) {
    await transaction.rollback();

    return {
      success: false,
      message: err.message || "Something went wrong",
      statusCode: 500,
    };
  }
};
