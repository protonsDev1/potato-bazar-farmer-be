import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class ColdStorageType extends Model<
  InferAttributes<ColdStorageType>,
  InferCreationAttributes<ColdStorageType>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare coldStorageType: string | null;
}

ColdStorageType.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    coldStorageType: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "ColdStorageType",
    tableName: "coldStorageTypes",
    timestamps: true,
  }
);

export default ColdStorageType;
