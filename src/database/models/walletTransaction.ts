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

class WalletTransaction extends Model<
  InferAttributes<WalletTransaction>,
  InferCreationAttributes<WalletTransaction>
> {
  declare id: CreationOptional<number>;
  declare walletId: number;
  declare createdBy: number;
  declare amount: number;
  declare type: "credit" | "debit";
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
