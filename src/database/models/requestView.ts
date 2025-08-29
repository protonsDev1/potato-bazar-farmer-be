import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import BuyRequest from "./buyRequest";
import SellRequest from "./sellRequest";

class RequestView extends Model<
  InferAttributes<RequestView>,
  InferCreationAttributes<RequestView>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare buyRequestId: number | null;
  declare sellRequestId: number | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

RequestView.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
      allowNull: false,
      onDelete: "CASCADE",
    },
    buyRequestId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "buyRequests", key: "id" },
      onDelete: "SET NULL",
    },
    sellRequestId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "sellRequests", key: "id" },
      onDelete: "SET NULL",
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "RequestView",
    tableName: "requestViews",
    timestamps: false,
    indexes: [
      { unique: true, fields: ["userId", "buyRequestId"] },
      { unique: true, fields: ["userId", "sellRequestId"] },
    ],
  }
);

BuyRequest.hasMany(RequestView, { foreignKey: "buyRequestId", as: "views" });
RequestView.belongsTo(BuyRequest, { foreignKey: "buyRequestId" });

SellRequest.hasMany(RequestView, { foreignKey: "sellRequestId", as: "views" });
RequestView.belongsTo(SellRequest, { foreignKey: "sellRequestId" });

export default RequestView;
