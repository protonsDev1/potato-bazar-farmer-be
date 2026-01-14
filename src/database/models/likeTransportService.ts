import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class LikeTransportService extends Model<
  InferAttributes<LikeTransportService>,
  InferCreationAttributes<LikeTransportService>
> {
  declare id: CreationOptional<number>;
  declare serviceId: number;
  declare userId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

LikeTransportService.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    serviceId: {
      type: DataTypes.INTEGER,
      references: { model: "transportServices", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "LikeTransportService",
    tableName: "likeTransportServices",
    timestamps: true,
  }
);

export default LikeTransportService;
