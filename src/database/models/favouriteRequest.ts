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

class FavouriteRequest extends Model<
  InferAttributes<FavouriteRequest>,
  InferCreationAttributes<FavouriteRequest>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare buyRequestId: number | null;
  declare sellRequestId: number | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

FavouriteRequest.init(
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
    modelName: "FavouriteRequest",
    tableName: "favouriteRequests",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "buyRequestId"],
      },
      {
        unique: true,
        fields: ["userId", "sellRequestId"],
      },
    ],
  }
);

BuyRequest.hasMany(FavouriteRequest, {
  foreignKey: "buyRequestId",
  as: "buyFavourites",
});

FavouriteRequest.belongsTo(BuyRequest, {
  foreignKey: "buyRequestId",
  as: "buyRequest",
});

SellRequest.hasMany(FavouriteRequest, {
  foreignKey: "sellRequestId",
  as: "sellFavourites",
});

FavouriteRequest.belongsTo(SellRequest, {
  foreignKey: "sellRequestId",
  as: "sellRequest",
});

export default FavouriteRequest;
