import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdminPriceDiscovery extends Model<
  InferAttributes<AdminPriceDiscovery>,
  InferCreationAttributes<AdminPriceDiscovery>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare isActive: boolean;
  declare position: number;
}

AdminPriceDiscovery.init(
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
    modelName: "AdminPriceDiscovery",
    tableName: "adminPriceDiscoveries",
    timestamps: true,
  }
);

export default AdminPriceDiscovery;
