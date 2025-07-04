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

class MarketCoverage extends Model<
  InferAttributes<MarketCoverage>,
  InferCreationAttributes<MarketCoverage>
> {
  declare id: CreationOptional<number>;
  declare traderId: ForeignKey<Trader["id"]>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MarketCoverage.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    traderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "traders", key: "id" },
      onDelete: "CASCADE",
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
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
    modelName: "MarketCoverage",
    tableName: "marketCoverages",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["traderId", "name"],
      },
    ],
  }
);

MarketCoverage.belongsTo(Trader, { foreignKey: "traderId", as: "trader" });
Trader.hasMany(MarketCoverage, {
  foreignKey: "traderId",
  as: "marketCoverages",
});

export default MarketCoverage;
