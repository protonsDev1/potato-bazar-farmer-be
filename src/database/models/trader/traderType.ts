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

class TraderType extends Model<
  InferAttributes<TraderType>,
  InferCreationAttributes<TraderType>
> {
  declare id: CreationOptional<number>;
  declare traderId: ForeignKey<Trader["id"]>;
  declare type: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TraderType.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    traderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "traders", key: "id" },
      onDelete: "CASCADE",
    },
    type: { type: DataTypes.STRING(100), allowNull: false },
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
    modelName: "TraderType",
    tableName: "traderTypes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["traderId", "type"],
      },
    ],
  }
);

TraderType.belongsTo(Trader, { foreignKey: "traderId", as: "trader" });
Trader.hasMany(TraderType, { foreignKey: "traderId", as: "traderTypes" });

export default TraderType;
