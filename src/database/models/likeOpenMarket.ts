import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import OpenMarketPlace from "./openMarketPlace";

class LikeOpenMarketPlace extends Model<
  InferAttributes<LikeOpenMarketPlace>,
  InferCreationAttributes<LikeOpenMarketPlace>
> {
  declare id: CreationOptional<number>;
  declare marketId: number;
  declare userId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

LikeOpenMarketPlace.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    marketId: {
      type: DataTypes.INTEGER,
      references: { model: "openMarketPlaces", key: "id" },
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
    modelName: "LikeOpenMarketPlace",
    tableName: "likeOpenMarketPlaces",
    timestamps: true,
  },
);

OpenMarketPlace.hasMany(LikeOpenMarketPlace, {
  foreignKey: "marketId",
  as: "likes",
});

LikeOpenMarketPlace.belongsTo(OpenMarketPlace, {
  foreignKey: "marketId",
  as: "openMarketPlace",
});

export default LikeOpenMarketPlace;
