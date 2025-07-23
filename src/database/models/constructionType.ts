import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import ColdStorage from "./coldStorage";

class ConstructionType extends Model<
  InferAttributes<ConstructionType>,
  InferCreationAttributes<ConstructionType>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare constructionType: string | null;
}

ConstructionType.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    constructionType: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "ConstructionType",
    tableName: "constructionTypes",
    timestamps: true,
  }
);

ConstructionType.belongsTo(ColdStorage, {
  foreignKey: "coldStorageId",
  as: "coldStorage",
});
ColdStorage.hasMany(ConstructionType, {
  foreignKey: "coldStorageId",
  as: "constructionTypes",
});

export default ConstructionType;
