import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import UserSubscription from "./userSubscription";

class SubscriptionPlan extends Model {
  declare id: number;
  declare name: string;
  declare price: number;
  declare durationInMonths: number;
  declare isActive: boolean;
}

SubscriptionPlan.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    name: { type: DataTypes.STRING, allowNull: false },

    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },

    durationInMonths: { type: DataTypes.INTEGER, allowNull: false },

    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    tableName: "subscriptionPlans",
    modelName: "SubscriptionPlan",
    timestamps: true,
  },
);

export default SubscriptionPlan;
