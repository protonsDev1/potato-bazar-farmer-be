import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdminStorageBookingSystem extends Model<
  InferAttributes<AdminStorageBookingSystem>,
  InferCreationAttributes<AdminStorageBookingSystem>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare isActive: boolean;
  declare position: number;
}

AdminStorageBookingSystem.init(
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
    modelName: "AdminStorageBookingSystem",
    tableName: "adminStorageBookingSystems",
    timestamps: true,
  }
);

export default AdminStorageBookingSystem;
