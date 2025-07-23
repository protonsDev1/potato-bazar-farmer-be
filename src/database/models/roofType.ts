import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import ColdStorage from "./coldStorage";

class RoofType extends Model<
  InferAttributes<RoofType>,
  InferCreationAttributes<RoofType>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare roofType: string | null;
}

RoofType.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    roofType: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "RoofType",
    tableName: "roofTypes",
    timestamps: true,
  }
);

RoofType.belongsTo(ColdStorage, {
  foreignKey: "coldStorageId",
  as: "coldStorage",
});
ColdStorage.hasMany(RoofType, {
  foreignKey: "coldStorageId",
  as: "roofTypes",
});


export default RoofType;
