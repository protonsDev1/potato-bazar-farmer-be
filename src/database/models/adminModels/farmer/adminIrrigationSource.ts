import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdminIrrigationSource extends Model<
  InferAttributes<AdminIrrigationSource>,
  InferCreationAttributes<AdminIrrigationSource>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare icon: string | null;
  declare isActive: boolean;
  declare position: number;
}

AdminIrrigationSource.init(
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
    modelName: "AdminIrrigationSource",
    tableName: "adminIrrigationSources",
    timestamps: true,
  }
);

export default AdminIrrigationSource;
