import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../../db";

class AdminTraderVariety extends Model<
  InferAttributes<AdminTraderVariety>,
  InferCreationAttributes<AdminTraderVariety>
> {
  declare id: CreationOptional<number>;
  declare variety: string;
  declare isActive: CreationOptional<boolean>;
  declare position: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AdminTraderVariety.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    variety: { type: DataTypes.STRING(100), allowNull: false },
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
    modelName: "AdminTraderVariety",
    tableName: "adminTraderVarieties",
    timestamps: true,
  }
);

export default AdminTraderVariety;
