import { Model, DataTypes } from "sequelize";
import sequelize from "./db";

export enum MODULES {
  BUY = "buy",
  SELL = "sell",
  COLD_STORAGE = "cold_storage",
  JOBS = "jobs",
  TRANSPORT = "transport",
}

class ModulePricing extends Model {}

ModulePricing.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    module: {
      type: DataTypes.STRING,
      unique: true,
    },

    pricePerContact: {
      type: DataTypes.DECIMAL(10, 2),
    },
  },
  {
    sequelize,
    tableName: "modulePricings",
  },
);

export default ModulePricing;
