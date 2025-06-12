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

class BankDetail extends Model<
  InferAttributes<BankDetail>,
  InferCreationAttributes<BankDetail>
> {
  declare id: CreationOptional<number>;
  declare traderId: ForeignKey<Trader["id"]>;
  declare bankName: string;
  declare accountNumber: string;
  declare ifscCode: string;
  declare upiId: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

BankDetail.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    traderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "traders", key: "id" },
      onDelete: "CASCADE",
    },
    bankName: { type: DataTypes.STRING(255), allowNull: false },
    accountNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    ifscCode: { type: DataTypes.STRING(20), allowNull: false },
    upiId: { type: DataTypes.STRING(100), unique: true },
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
    modelName: "BankDetail",
    tableName: "bankDetails",
    timestamps: true,
  }
);

BankDetail.belongsTo(Trader, { foreignKey: "traderId", as: "trader" });
Trader.hasOne(BankDetail, { foreignKey: "traderId", as: "bankDetail" });

export default BankDetail;
