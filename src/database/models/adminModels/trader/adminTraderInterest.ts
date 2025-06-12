import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../../db";

class AdminTraderInterest extends Model<
  InferAttributes<AdminTraderInterest>,
  InferCreationAttributes<AdminTraderInterest>
> {
  declare id: CreationOptional<number>;
  declare interest: string;
  declare isActive: CreationOptional<boolean>;
  declare position: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AdminTraderInterest.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    interest: { type: DataTypes.STRING(100), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
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
    modelName: "AdminTraderInterest",
    tableName: "adminTraderInterests",
    timestamps: true,
  }
);

export default AdminTraderInterest;
