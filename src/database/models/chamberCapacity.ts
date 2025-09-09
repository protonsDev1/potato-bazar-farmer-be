import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import ColdStorage from "./coldStorage";

class ChamberCapacity extends Model<
  InferAttributes<ChamberCapacity>,
  InferCreationAttributes<ChamberCapacity>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare noOfFloors: number | null;
  declare capacityInBags: number | null;
  declare capacityMt: number | null;
  declare description: string | null;
}

ChamberCapacity.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    noOfFloors: { type: DataTypes.INTEGER, allowNull: true },
    capacityInBags: { type: DataTypes.DECIMAL, allowNull: true },
    capacityMt: { type: DataTypes.DECIMAL, allowNull: true },
    description: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "ChamberCapacity",
    tableName: "chamberCapacities",
    timestamps: true,
  }
);

ChamberCapacity.belongsTo(ColdStorage, {
  foreignKey: "coldStorageId",
  as: "coldStorage",
});
ColdStorage.hasMany(ChamberCapacity, {
  foreignKey: "coldStorageId",
  as: "chamberCapacities",
});

export default ChamberCapacity;
