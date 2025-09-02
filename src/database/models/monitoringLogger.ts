import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class MonitoringLogger extends Model<
  InferAttributes<MonitoringLogger>,
  InferCreationAttributes<MonitoringLogger>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare type: string | null;
}

MonitoringLogger.init(
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
    modelName: "MonitoringLogger",
    tableName: "monitoringLoggers",
    timestamps: true,
  }
);

export default MonitoringLogger;
