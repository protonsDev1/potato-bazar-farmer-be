import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import User from "./user";
import BannerAdPlan from "./bannerAdPlan";

class UserBannerAdSubscription extends Model {}

UserBannerAdSubscription.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    userId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },

    planId: {
      type: DataTypes.INTEGER,
      references: { model: "bannerAdPlans", key: "id" },
    },

    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,

    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
    },
  },
  {
    sequelize,
    tableName: "userBannerAdSubscriptions",
  },
);

export default UserBannerAdSubscription;
