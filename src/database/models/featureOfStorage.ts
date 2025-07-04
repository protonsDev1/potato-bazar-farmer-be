import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class FeatureOfStorage extends Model<
  InferAttributes<FeatureOfStorage>,
  InferCreationAttributes<FeatureOfStorage>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare feature: string | null;
}

FeatureOfStorage.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    feature: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "FeatureOfStorage",
    tableName: "featureOfStorage",
    timestamps: true,
  }
);

export default FeatureOfStorage;
