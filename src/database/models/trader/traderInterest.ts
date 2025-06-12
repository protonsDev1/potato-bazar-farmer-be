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

class TraderInterest extends Model<
  InferAttributes<TraderInterest>,
  InferCreationAttributes<TraderInterest>
> {
  declare id: CreationOptional<number>;
  declare traderId: ForeignKey<Trader["id"]>;
  declare interest: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TraderInterest.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    traderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "traders", key: "id" },
      onDelete: "CASCADE",
    },
    interest: { type: DataTypes.STRING(100), allowNull: false },
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
    modelName: "TraderInterest",
    tableName: "traderInterests",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["traderId", "interest"],
      },
    ],
  }
);

TraderInterest.belongsTo(Trader, { foreignKey: "traderId", as: "trader" });
Trader.hasMany(TraderInterest, {
  foreignKey: "traderId",
  as: "traderInterests",
});

export default TraderInterest;
