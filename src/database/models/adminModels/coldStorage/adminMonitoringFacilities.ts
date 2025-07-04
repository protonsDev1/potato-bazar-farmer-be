import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdminMonitoringFacility extends Model<
  InferAttributes<AdminMonitoringFacility>,
  InferCreationAttributes<AdminMonitoringFacility>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare isActive: boolean;
  declare position: number;
}

AdminMonitoringFacility.init(
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
    modelName: "AdminMonitoringFacility",
    tableName: "adminMonitoringFacilities",
    timestamps: true,
  }
);

export default AdminMonitoringFacility;
