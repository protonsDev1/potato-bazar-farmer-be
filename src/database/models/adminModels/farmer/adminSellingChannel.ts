import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdminSellingChannel extends Model<
  InferAttributes<AdminSellingChannel>,
  InferCreationAttributes<AdminSellingChannel>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare isActive: boolean;
  declare position: number;
  declare isDeleted: boolean;
}

AdminSellingChannel.init(
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
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "AdminSellingChannel",
    tableName: "adminSellingChannels",
    timestamps: true,
  }
);

export default AdminSellingChannel;
