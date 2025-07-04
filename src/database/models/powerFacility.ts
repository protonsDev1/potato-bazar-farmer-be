import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class PowerFacility extends Model<
  InferAttributes<PowerFacility>,
  InferCreationAttributes<PowerFacility>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare facility: string | null;
  declare capacityInKw: number | null;
  declare backupInHrs: number | null;
  declare make: string | null;
}

PowerFacility.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    facility: { type: DataTypes.STRING, allowNull: true },
    capacityInKw: { type: DataTypes.DECIMAL, allowNull: true },
    backupInHrs: { type: DataTypes.DECIMAL, allowNull: true },
    make: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "PowerFacility",
    tableName: "powerFacilities",
    timestamps: true,
  }
);

export default PowerFacility;
