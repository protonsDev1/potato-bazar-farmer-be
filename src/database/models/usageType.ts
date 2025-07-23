import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import ColdStorage from "./coldStorage";

class UsageType extends Model<
  InferAttributes<UsageType>,
  InferCreationAttributes<UsageType>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare type: string | null;
  declare capacity: number | null;
}

UsageType.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    type: { type: DataTypes.STRING, allowNull: true },
    capacity: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "UsageType",
    tableName: "usageTypes",
    timestamps: true,
  }
);

UsageType.belongsTo(ColdStorage, {
  foreignKey: "coldStorageId",
  as: "coldStorage",
});
ColdStorage.hasMany(UsageType, {
  foreignKey: "coldStorageId",
  as: "usageTypes",
});

export default UsageType;
