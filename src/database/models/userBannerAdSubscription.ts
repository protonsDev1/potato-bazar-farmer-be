import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import User from "./user";
import BannerAdPlan from "./bannerAdPlan";

class UserBannerAdSubscription extends Model {
  declare id: number;
  declare userId: number;
  declare planId: number;
  declare startDate: Date;
  declare endDate: Date;
  declare status: string;
}

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

BannerAdPlan.hasMany(UserBannerAdSubscription, {
  foreignKey: "planId",
  as: "bannerAdPlans",
});

UserBannerAdSubscription.belongsTo(BannerAdPlan, {
  foreignKey: "planId",
  as: "plan",
});

export default UserBannerAdSubscription;
