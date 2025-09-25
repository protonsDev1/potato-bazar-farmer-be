import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import ColdStorage from "./coldStorage";

class DryingMethod extends Model<
  InferAttributes<DryingMethod>,
  InferCreationAttributes<DryingMethod>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare method: string | null;
}

DryingMethod.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    method: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "DryingMethod",
    tableName: "dryingMethods",
    timestamps: true,
  }
);

DryingMethod.belongsTo(ColdStorage, {
  foreignKey: "coldStorageId",
  as: "coldStorage",
});
ColdStorage.hasMany(DryingMethod, {
  foreignKey: "coldStorageId",
  as: "dryingMethods",
});

export default DryingMethod;
