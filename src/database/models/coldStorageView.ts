import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import ColdStorage from "./coldStorage";

class ColdStorageView extends Model<
  InferAttributes<ColdStorageView>,
  InferCreationAttributes<ColdStorageView>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare userId: number;
}

ColdStorageView.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ColdStorageView",
    tableName: "coldStorageViews",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "coldStorageId"],
      },
    ],
  }
);

ColdStorage.hasMany(ColdStorageView, {
  foreignKey: "coldStorageId",
  as: "views",
});

ColdStorageView.belongsTo(ColdStorage, {
  foreignKey: "coldStorageId",
  as: "coldStorage",
});

export default ColdStorageView;
