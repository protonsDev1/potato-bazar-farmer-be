import sequelize from "../database/models/db";
import BannerAdPlan from "../database/models/bannerAdPlan";
import UserBannerAdSubscription from "../database/models/userBannerAdSubscription";
import Wallet from "../database/models/wallet";
import WalletTransaction, {
  USAGE_TYPE,
} from "../database/models/walletTransaction";
import { Op } from "sequelize";

// ✅ Create Plan
export const createPlan = async (data) => {
  try {
    const plan = await BannerAdPlan.create(data);

    return {
      success: true,
      message: "Banner plan created successfully",
      statusCode: 201,
      data: plan,
    };
  } catch (err) {
    return { success: false, message: err.message, statusCode: 400 };
  }
};

// ✅ Update Plan
export const updatePlan = async (id, data) => {
  try {
    const plan = await BannerAdPlan.findByPk(id);

    if (!plan) {
      return { success: false, message: "Plan not found", statusCode: 404 };
    }

    await plan.update(data);

    return {
      success: true,
      message: "Banner plan updated successfully",
      statusCode: 200,
      data: plan,
    };
  } catch (err) {
    return { success: false, message: err.message, statusCode: 400 };
  }
};

// ✅ List Plans
export const getPlans = async (filters: any = {}) => {
  try {
    const where: any = {};

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const plans = await BannerAdPlan.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return {
      success: true,
      message: "Banner plans fetched",
      statusCode: 200,
      data: plans,
    };
  } catch (err) {
    return { success: false, message: err.message, statusCode: 400 };
  }
};

// ✅ Get Plan by ID
export const getPlanById = async (id) => {
  try {
    const plan = await BannerAdPlan.findByPk(id);

    if (!plan) {
      return { success: false, message: "Plan not found", statusCode: 404 };
    }

    return {
      success: true,
      message: "Plan fetched",
      statusCode: 200,
      data: plan,
    };
  } catch (err) {
    return { success: false, message: err.message, statusCode: 400 };
  }
};

// ✅ Get My Subscription
export const getMySubscription = async (userId: number) => {
  try {
    const now = new Date();

    const subscription = await UserBannerAdSubscription.findOne({
      where: {
        userId,
        status: "active",
        endDate: {
          [Op.gt]: now, // only non-expired
        },
      },
      include: [
        {
          model: BannerAdPlan,
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

// 🔥 Buy Plan (Wallet Flow)
export const buyPlan = async (userId: number, planId: number) => {
  const transaction = await sequelize.transaction();

  try {
    const now = new Date();

    const plan = await BannerAdPlan.findByPk(planId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!plan || !plan.isActive) {
      await transaction.rollback();
      return { success: false, message: "Invalid plan", statusCode: 400 };
    }

    const wallet = await Wallet.findOne({
      where: { userId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!wallet) {
      await transaction.rollback();
      return { success: false, message: "Wallet not found", statusCode: 404 };
    }

    const price = parseFloat(plan.price as any);

    if (parseFloat(wallet.balance as any) < price) {
      await transaction.rollback();
      return {
        success: false,
        message: "Insufficient balance",
        wallet,
        statusCode: 400,
      };
    }

    // 🔥 Deduct wallet (same logic)
    let remaining = price;
    let userBalance = parseFloat(wallet.userBalance as any);
    let adminBalance = parseFloat(wallet.adminBalance as any);

    if (userBalance >= remaining) {
      userBalance -= remaining;
    } else {
      remaining -= userBalance;
      userBalance = 0;
      adminBalance -= remaining;
    }

    wallet.userBalance = userBalance;
    wallet.adminBalance = adminBalance;
    wallet.balance = userBalance + adminBalance;

    await wallet.save({ transaction });

    // 🔍 Existing subscription
    const existing = await UserBannerAdSubscription.findOne({
      where: { userId, status: "active" },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    let subscription;
    let actionType = "purchase";

    if (existing) {
      const isExpired = !existing.endDate || new Date(existing.endDate) <= now;

      if (existing.planId === plan.id) {
        actionType = "renewal";

        let baseDate =
          !isExpired && existing.endDate ? new Date(existing.endDate) : now;

        const newEndDate = new Date(baseDate);
        newEndDate.setDate(newEndDate.getDate() + plan.durationInDays);

        existing.endDate = newEndDate;
        await existing.save({ transaction });

        subscription = existing;
      } else {
        actionType = "upgrade";

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.durationInDays);

        existing.planId = plan.id;
        existing.startDate = now;
        existing.endDate = endDate;

        await existing.save({ transaction });

        subscription = existing;
      }
    } else {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.durationInDays);

      subscription = await UserBannerAdSubscription.create(
        {
          userId,
          planId,
          startDate: now,
          endDate,
          status: "active",
        },
        { transaction },
      );
    }

    // 💸 Wallet transaction
    await WalletTransaction.create(
      {
        walletId: wallet.id,
        createdBy: userId,
        amount: price,
        type: "debit",
        usageType: USAGE_TYPE.BANNER_AD,
        referenceId: plan.id,
        description: `Banner ad ${actionType}`,
      },
      { transaction },
    );

    await transaction.commit();

    return {
      success: true,
      message: `Banner plan ${actionType} successful`,
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
