import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "./db";
import User from "./user";

export enum PAYMENT_STATUS {
  CREATED = "created",
  SUCCESS = "success",
  FAILED = "failed",
}

export enum PAYMENT_TYPE {
  WALLET_TOPUP = "wallet_topup",
}

class PaymentTransaction extends Model<
  InferAttributes<PaymentTransaction>,
  InferCreationAttributes<PaymentTransaction>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare razorpayOrderId: string;
  declare razorpayPaymentId: string;
  declare amount: number;
  declare type: string;
  declare status: string;
  declare metadata: CreationOptional<object>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PaymentTransaction.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },

    razorpayOrderId: { type: DataTypes.STRING },
    razorpayPaymentId: { type: DataTypes.STRING },

    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },

    type: { type: DataTypes.STRING },

    status: {
      type: DataTypes.STRING,
      defaultValue: PAYMENT_STATUS.CREATED,
    },

    metadata: { type: DataTypes.JSON },

    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: "paymentTransactions",
    modelName: "PaymentTransaction",
    timestamps: true,
  },
);

User.hasMany(PaymentTransaction, {
  foreignKey: "userId",
  as: "paymentTransactions",
});

PaymentTransaction.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default PaymentTransaction;
