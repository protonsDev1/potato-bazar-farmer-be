import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import Brand from "./Brand";
import Product from "./Product";

class Endorsement extends Model {
  declare id: number;
  declare title: string;
  declare headline: string;
  declare disease: string;
  declare brand_id: number;
  declare product_id: number;
  declare cta_text?: string;
  declare cta_url?: string;
  declare start_at?: Date;
  declare end_at?: Date;
  declare status: string;
  declare image?: string;
  declare notes?: string;
  declare sort_order?: number;
}

Endorsement.init(
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
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    headline: { type: DataTypes.STRING, allowNull: false },
    disease: { type: DataTypes.STRING, allowNull: false },
    cta_text: { type: DataTypes.STRING },
    cta_url: { type: DataTypes.STRING },
    start_at: { type: DataTypes.DATEONLY },
    end_at: { type: DataTypes.DATEONLY },
    status: {
      type: DataTypes.ENUM("draft", "approved", "paused", "archived"),
      defaultValue: "draft",
    },
    image: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    sequelize,
    modelName: "Endorsement",
    tableName: "endorsements",
    timestamps: true,
  }
);

// ✅ Associations — only upward
Endorsement.belongsTo(Brand, { foreignKey: "brand_id" });
Endorsement.belongsTo(Product, { foreignKey: "product_id" });

export default Endorsement;
