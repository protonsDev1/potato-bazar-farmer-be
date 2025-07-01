import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import Farmer from "./farmer";

class SellingPrice extends Model<
  InferAttributes<SellingPrice>,
  InferCreationAttributes<SellingPrice>
> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare price: string;
}

SellingPrice.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmerId: {
      type: DataTypes.INTEGER,
      references: { model: "Farmers", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    price: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "SellingPrice",
    tableName: "sellingPrices",
    timestamps: true,
    indexes: [{ fields: ["farmerId"] }],
  }
);

Farmer.hasMany(SellingPrice, { foreignKey: "farmerId" });
SellingPrice.belongsTo(Farmer, { foreignKey: "farmerId" });

export default SellingPrice;
