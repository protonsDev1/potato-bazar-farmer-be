import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class LikeColdStorage extends Model<
  InferAttributes<LikeColdStorage>,
  InferCreationAttributes<LikeColdStorage>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare userId: number;
}

LikeColdStorage.init(
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
    modelName: "LikeColdStorage",
    tableName: "likeColdStorages",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "coldStorageId"],
      },
    ],
  }
);

export default LikeColdStorage;
