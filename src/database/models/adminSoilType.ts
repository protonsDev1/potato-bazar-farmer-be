import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "./db";

class AdminSoilType extends Model<
  InferAttributes<AdminSoilType>,
  InferCreationAttributes<AdminSoilType>
> {
  declare id: CreationOptional<number>;
  declare name_en: string;
  declare name_hi: string;
  declare icon: string | null;
  declare isActive: boolean;
  declare position: number;
}

AdminSoilType.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name_en: { type: DataTypes.STRING, allowNull: false },
    name_hi: { type: DataTypes.STRING, allowNull: false },
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
    tableName: "AdminSoilType",
    timestamps: true,
  }
);

export default AdminSoilType;
