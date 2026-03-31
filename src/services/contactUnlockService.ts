import sequelize from "../database/models/db";
import ModulePricing from "../database/models/modulePricing";
import ContactUnlock from "../database/models/contactUnlock";
import Wallet from "../database/models/wallet";
import WalletTransaction, {
  USAGE_TYPE,
} from "../database/models/walletTransaction";
import UserSubscription from "../database/models/userSubscription";

// ✅ Create Pricing
export const createModulePricing = async (data) => {
  try {
    const exists = await ModulePricing.findOne({
      where: { module: data.module },
    });

    if (exists) {
      return {
        success: false,
        message: "Pricing already exists for this module",
        statusCode: 400,
      };
    }

    const pricing = await ModulePricing.create(data);

    return {
      success: true,
      message: "Module pricing created",
      statusCode: 201,
      data: pricing,
    };
  } catch (err) {
    return { success: false, message: err.message, statusCode: 400 };
  }
};

// ✅ Update Pricing
export const updateModulePricing = async (id, data) => {
  try {
    const pricing = await ModulePricing.findByPk(id);

    if (!pricing) {
      return { success: false, message: "Pricing not found", statusCode: 404 };
    }

    if (data.module) {
      const exists = await ModulePricing.findOne({
        where: {
          module: data.module,
        },
      });

      if (exists && exists.id !== Number(id)) {
        return {
          success: false,
          message: "Pricing already exists for this module",
          statusCode: 400,
        };
      }
    }

    await pricing.update(data);

    return {
      success: true,
      message: "Pricing updated",
      statusCode: 200,
      data: pricing,
    };
  } catch (err) {
    return { success: false, message: err.message, statusCode: 400 };
  }
};

// ✅ List
export const getModulePricings = async (filters: any = {}) => {
  try {
    const where: any = {};

    // ✅ Apply isActive filter if passed
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const list = await ModulePricing.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return {
      success: true,
      message: "Module pricing list",
      statusCode: 200,
      data: list,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "Failed to fetch module pricing",
      statusCode: 400,
    };
  }
};

// ✅ Get by ID
export const getModulePricingById = async (id) => {
  const pricing = await ModulePricing.findByPk(id);

  if (!pricing) {
    return { success: false, message: "Not found", statusCode: 404 };
  }

  return {
    success: true,
    message: "Fetched",
    statusCode: 200,
    data: pricing,
  };
};

// 🔥 UNLOCK CONTACT (MAIN LOGIC)
export const unlockContact = async (userId: number, payload: any) => {
  const transaction = await sequelize.transaction();

  try {
    const { modulePricingId, recordId } = payload;

    // 🔒 Get pricing
    const pricing = await ModulePricing.findByPk(modulePricingId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!pricing || !pricing.isActive) {
      await transaction.rollback();
      return {
        success: false,
        message: "Invalid or inactive module pricing",
        statusCode: 400,
      };
    }

    // ✅ Already unlocked?
    const existingUnlock = await ContactUnlock.findOne({
      where: { userId, modulePricingId, recordId },
      transaction,
    });

    if (existingUnlock) {
      await transaction.commit();
      return {
        success: true,
        message: "Already unlocked",
        statusCode: 200,
        data: existingUnlock,
      };
    }

    // ✅ Subscription check
    const activeSubscription = await UserSubscription.findOne({
      where: { userId, status: "active" },
      transaction,
    });

    let price = 0;
    let paymentSource = "subscription";

    if (!activeSubscription) {
      price = parseFloat(pricing.pricePerContact as any);
      paymentSource = "wallet";

      const wallet = await Wallet.findOne({
        where: { userId },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!wallet || parseFloat(wallet.balance as any) < price) {
        await transaction.rollback();
        return {
          success: false,
          message: "Insufficient balance",
          statusCode: 400,
        };
      }

      // 💰 Deduction logic
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

      // 💸 Wallet transaction
      await WalletTransaction.create(
        {
          walletId: wallet.id,
          createdBy: userId,
          amount: price,
          type: "debit",
          usageType: USAGE_TYPE.CONTACT_UNLOCK,
          referenceId: recordId,
          description: `Contact unlock (${pricing.module})`,
        },
        { transaction },
      );
    }

    // ✅ Create unlock
    const unlock = await ContactUnlock.create(
      {
        userId,
        modulePricingId,
        recordId,
        price,
        paymentSource,
      },
      { transaction },
    );

    await transaction.commit();

    return {
      success: true,
      message: "Contact unlocked successfully",
      statusCode: 200,
      data: unlock,
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
