import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../db";

class AdminSoilType extends Model<
  InferAttributes<AdminSoilType>,
  InferCreationAttributes<AdminSoilType>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare icon: string | null;
  declare isActive: boolean;
  declare position: number;
}

AdminSoilType.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "AdminSoilType",
    tableName: "adminSoilTypes",
    timestamps: true,
  }
);

export default AdminSoilType;
