import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdminUsageType extends Model<
  InferAttributes<AdminUsageType>,
  InferCreationAttributes<AdminUsageType>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare isActive: boolean;
  declare position: number;
}

AdminUsageType.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
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
    modelName: "AdminUsageType",
    tableName: "adminUsageTypes",
    timestamps: true,
  }
);

export default AdminUsageType;
