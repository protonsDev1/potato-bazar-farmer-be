import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdminStorageType extends Model<
  InferAttributes<AdminStorageType>,
  InferCreationAttributes<AdminStorageType>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare isActive: boolean;
  declare position: number;
}

AdminStorageType.init(
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
    modelName: "AdminStorageType",
    tableName: "adminStorageTypes",
    timestamps: true,
  }
);

export default AdminStorageType;
