import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import Brand from "./Brand";

class Product extends Model {
  declare id: number;
  declare name: string;
  declare brand_id: number;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
  }
);

// ✅ Associations here — only upward import
Product.belongsTo(Brand, { foreignKey: "brand_id" });

export default Product;
