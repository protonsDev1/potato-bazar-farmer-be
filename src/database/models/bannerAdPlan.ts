import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import UserBannerAdSubscription from "./userBannerAdSubscription";

class BannerAdPlan extends Model {}

BannerAdPlan.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    durationInMonths: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "bannerAdPlans",
  },
);

export default BannerAdPlan;
