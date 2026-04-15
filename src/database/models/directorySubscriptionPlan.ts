import { Model, DataTypes } from "sequelize";
import sequelize from "./db";

class DirectorySubscriptionPlan extends Model {
  declare id: number;
  declare name: string;
  declare price: number;
  declare durationInMonths: number;
  declare isActive: boolean;
}

DirectorySubscriptionPlan.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL(12, 2),
    durationInMonths: DataTypes.INTEGER,
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    tableName: "directorySubscriptionPlans",
    modelName: "DirectorySubscriptionPlan",
  },
);

export default DirectorySubscriptionPlan;
