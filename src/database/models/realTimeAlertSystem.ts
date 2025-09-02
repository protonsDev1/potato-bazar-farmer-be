import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class RealTimeAlertSystem extends Model<
  InferAttributes<RealTimeAlertSystem>,
  InferCreationAttributes<RealTimeAlertSystem>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare type: string | null;
}

RealTimeAlertSystem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    type: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "RealTimeAlertSystem",
    tableName: "realTimeAlertSystems",
    timestamps: true,
  }
);

export default RealTimeAlertSystem;
