import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import UserBannerAdSubscription from "./userBannerAdSubscription";

class BannerAdPlan extends Model {
  declare id: number;
  declare name: string;
  declare price: number;
  declare durationInDays: number;
  declare isActive: boolean;
}

BannerAdPlan.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    durationInDays: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    tableName: "bannerAdPlans",
  },
);

export default BannerAdPlan;
