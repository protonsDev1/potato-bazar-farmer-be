import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import UserDirectorySubscription from "./userDirectorySubscription";

class DirectorySubscriptionPlan extends Model {
  declare id: number;
  declare name: string;
  declare price: number;
  declare durationInMonths: number;
}

DirectorySubscriptionPlan.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL(12, 2),
    durationInMonths: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "directorySubscriptionPlans",
    modelName: "DirectorySubscriptionPlan",
  },
);

DirectorySubscriptionPlan.hasMany(UserDirectorySubscription, {
  foreignKey: "planId",
  as: "subscriptions",
});

export default DirectorySubscriptionPlan;
