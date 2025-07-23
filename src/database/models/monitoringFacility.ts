import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import ColdStorage from "./coldStorage";

class MonitoringFacility extends Model<
  InferAttributes<MonitoringFacility>,
  InferCreationAttributes<MonitoringFacility>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare facility: string | null;
}

MonitoringFacility.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    facility: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "MonitoringFacility",
    tableName: "monitoringFacilities",
    timestamps: true,
  }
);

MonitoringFacility.belongsTo(ColdStorage, {
  foreignKey: "coldStorageId",
  as: "coldStorage",
});
ColdStorage.hasMany(MonitoringFacility, {
  foreignKey: "coldStorageId",
  as: "monitoringFacilities",
});

export default MonitoringFacility;
