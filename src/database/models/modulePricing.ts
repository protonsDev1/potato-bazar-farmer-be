import { Model, DataTypes } from "sequelize";
import sequelize from "./db";

export enum MODULES {
  BUY = "buy",
  SELL = "sell",
  COLD_STORAGE = "cold_storage",
  JOB = "job",
  TRANSPORT = "transport",
  MARKET_PLACE = "market_place",
}

class ModulePricing extends Model {
  declare id: number;
  declare module: string;
  declare pricePerContact: number;
  declare isActive: boolean;
}

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

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "modulePricings",
  },
);

export default ModulePricing;
