import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import Wallet from "./wallet";
import User from "./user";

export enum USAGE_TYPE {
  WALLET_TOPUP = "wallet_topup",
  SUBSCRIPTION = "subscription",
  DIRECTORY_SUBSCRIPTION = "directory_subscription",
  BANNER_AD = "banner_ad",
  CONTACT_UNLOCK = "contact_unlock",
  ADMIN_CREDIT = "admin_credit",
  ADMIN_DEBIT = "admin_debit",
}

class WalletTransaction extends Model<
  InferAttributes<WalletTransaction>,
  InferCreationAttributes<WalletTransaction>
> {
  declare id: CreationOptional<number>;
  declare walletId: number;
  declare createdBy: number;
  declare amount: number;
  declare type: "credit" | "debit";
  declare source: string;
  declare usageType: CreationOptional<string>;
  declare referenceId: CreationOptional<number>;
  declare description: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

WalletTransaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    walletId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("credit", "debit"),
      allowNull: false,
    },

    source: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "system",
    },

    usageType: {
      type: DataTypes.STRING,
    },

    referenceId: {
      type: DataTypes.INTEGER,
    },

    description: {
      type: DataTypes.TEXT,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "walletTransactions",
    timestamps: true,
  },
);

Wallet.hasMany(WalletTransaction, {
  foreignKey: "walletId",
  as: "transactions",
});
WalletTransaction.belongsTo(Wallet, { foreignKey: "walletId", as: "wallet" });

User.hasMany(WalletTransaction, {
  foreignKey: "createdBy",
  as: "transactions",
});
WalletTransaction.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

export default WalletTransaction;
