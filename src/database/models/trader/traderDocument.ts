import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import sequelize from "../db";
import Trader from "./trader";

class TraderDocument extends Model<
  InferAttributes<TraderDocument>,
  InferCreationAttributes<TraderDocument>
> {
  declare id: CreationOptional<number>;
  declare traderId: ForeignKey<Trader["id"]>;
  declare panCardUrl: string | null;
  declare businessCardUrl: string | null;
  declare tradeLicenseUrl: string | null;
  declare recentInvoiceUrl: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TraderDocument.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    traderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "traders", key: "id" },
      onDelete: "CASCADE",
    },
    panCardUrl: { type: DataTypes.TEXT },
    businessCardUrl: { type: DataTypes.TEXT },
    tradeLicenseUrl: { type: DataTypes.TEXT },
    recentInvoiceUrl: { type: DataTypes.TEXT },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TraderDocument",
    tableName: "traderDocuments",
    timestamps: true,
  }
);

TraderDocument.belongsTo(Trader, { foreignKey: "traderId", as: "trader" });
Trader.hasOne(TraderDocument, { foreignKey: "traderId", as: "document" });

export default TraderDocument;
