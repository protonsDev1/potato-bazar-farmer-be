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

class TraderVariety extends Model<
  InferAttributes<TraderVariety>,
  InferCreationAttributes<TraderVariety>
> {
  declare id: CreationOptional<number>;
  declare traderId: ForeignKey<Trader["id"]>;
  declare variety: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TraderVariety.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    traderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "traders", key: "id" },
      onDelete: "CASCADE",
    },
    variety: { type: DataTypes.STRING(100), allowNull: false },
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
    modelName: "TraderVariety",
    tableName: "traderVarieties",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["traderId", "variety"],
      },
    ],
  }
);

TraderVariety.belongsTo(Trader, { foreignKey: "traderId", as: "trader" });
Trader.hasMany(TraderVariety, { foreignKey: "traderId", as: "traderVarieties" });

export default TraderVariety;
