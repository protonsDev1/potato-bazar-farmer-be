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

class CropTraded extends Model<
  InferAttributes<CropTraded>,
  InferCreationAttributes<CropTraded>
> {
  declare id: CreationOptional<number>;
  declare traderId: ForeignKey<Trader["id"]>;
  declare cropName: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CropTraded.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    traderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "traders", key: "id" },
      onDelete: "CASCADE",
    },
    cropName: { type: DataTypes.STRING(100), allowNull: false },
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
    modelName: "CropTraded",
    tableName: "cropsTraded",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["traderId", "cropName"],
      },
    ],
  }
);

CropTraded.belongsTo(Trader, { foreignKey: "traderId", as: "trader" });
Trader.hasMany(CropTraded, { foreignKey: "traderId", as: "cropsTraded" });

export default CropTraded;
