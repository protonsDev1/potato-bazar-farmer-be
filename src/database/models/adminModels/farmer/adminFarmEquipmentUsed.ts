import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdminFarmEquipmentUsed extends Model<
  InferAttributes<AdminFarmEquipmentUsed>,
  InferCreationAttributes<AdminFarmEquipmentUsed>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare icon: string;
  declare isActive: boolean;
  declare position: number;
}

AdminFarmEquipmentUsed.init(
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
    modelName: "AdminFarmEquipmentUsed",
    tableName: "adminFarmEquipmentsUsed",
    timestamps: true,
  }
);

export default AdminFarmEquipmentUsed;
