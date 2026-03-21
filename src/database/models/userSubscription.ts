import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import User from "./user";
import SubscriptionPlan from "./subscriptionPlan";

export enum SUBSCRIPTION_STATUS {
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

class UserSubscription extends Model {
  declare id: number;
  declare userId: number;
  declare planId: number;
  declare startDate: Date;
  declare endDate: Date;
  declare status: string;
  declare paymentSource: string;
}

UserSubscription.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    userId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },

    planId: {
      type: DataTypes.INTEGER,
      references: { model: "subscriptionPlans", key: "id" },
    },

    startDate: { type: DataTypes.DATE },
    endDate: { type: DataTypes.DATE },

    status: {
      type: DataTypes.STRING,
      defaultValue: SUBSCRIPTION_STATUS.ACTIVE,
    },

    paymentSource: { type: DataTypes.STRING },
  },
  {
    sequelize,
    tableName: "userSubscriptions",
    modelName: "UserSubscription",
    timestamps: true,
  },
);

User.hasMany(UserSubscription, { foreignKey: "userId", as: "subscriptions" });
UserSubscription.belongsTo(User, { foreignKey: "userId", as: "user" });

SubscriptionPlan.hasMany(UserSubscription, {
  foreignKey: "planId",
  as: "userSubscriptions",
});
UserSubscription.belongsTo(SubscriptionPlan, {
  foreignKey: "planId",
  as: "plan",
});

export default UserSubscription;
