import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdminPotatoVarietyGrown extends Model<
  InferAttributes<AdminPotatoVarietyGrown>,
  InferCreationAttributes<AdminPotatoVarietyGrown>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare isActive: boolean;
  declare position: number;
}

AdminPotatoVarietyGrown.init(
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
    modelName: "AdminPotatoVarietyGrown",
    tableName: "adminPotatoVarietiesGrown",
    timestamps: true,
  }
);

export default AdminPotatoVarietyGrown;
