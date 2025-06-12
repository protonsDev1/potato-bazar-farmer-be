import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdminPotatoSubVarietyGrown extends Model<
  InferAttributes<AdminPotatoSubVarietyGrown>,
  InferCreationAttributes<AdminPotatoSubVarietyGrown>
> {
  declare id: CreationOptional<number>;
  declare varietyId: number;
  declare name: string;
  declare isActive: boolean;
  declare position: number;
}

AdminPotatoSubVarietyGrown.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    varietyId: {
      type: DataTypes.INTEGER,
      references: { model: "adminPotatoVarietiesGrown", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
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
    modelName: "AdminPotatoSubVarietyGrown",
    tableName: "adminPotatoSubVarietiesGrown",
    timestamps: true,
  }
);

export default AdminPotatoSubVarietyGrown;
