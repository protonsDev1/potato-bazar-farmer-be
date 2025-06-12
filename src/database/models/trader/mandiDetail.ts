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

class MandiDetail extends Model<
  InferAttributes<MandiDetail>,
  InferCreationAttributes<MandiDetail>
> {
  declare id: CreationOptional<number>;
  declare traderId: ForeignKey<Trader["id"]>;
  declare state: string;
  declare cityOrVillage: string;
  declare mandiName: string;
  declare shopNumber: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MandiDetail.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    traderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "traders", key: "id" },
      onDelete: "CASCADE",
    },
    state: { type: DataTypes.STRING(100), allowNull: false },
    cityOrVillage: { type: DataTypes.STRING(100), allowNull: false },
    mandiName: { type: DataTypes.STRING(100), allowNull: false },
    shopNumber: { type: DataTypes.STRING(50) },
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
    modelName: "MandiDetail",
    tableName: "mandiDetails",
    timestamps: true,
  }
);

MandiDetail.belongsTo(Trader, { foreignKey: "traderId", as: "trader" });
Trader.hasOne(MandiDetail, { foreignKey: "traderId", as: "mandiDetail" });

export default MandiDetail;
