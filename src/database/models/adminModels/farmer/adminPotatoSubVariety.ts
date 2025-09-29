import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";
import AdminPotatoVarietyGrown from "./adminPotatoVarietyGrown";

class AdminPotatoSubVarietyGrown extends Model<
  InferAttributes<AdminPotatoSubVarietyGrown>,
  InferCreationAttributes<AdminPotatoSubVarietyGrown>
> {
  declare id: CreationOptional<number>;
  declare varietyId: number;
  declare name: string;
  declare isActive: boolean;
  declare position: number;
  declare isDeleted: boolean;
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
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "AdminPotatoSubVarietyGrown",
    tableName: "adminPotatoSubVarietiesGrown",
    timestamps: true,
  }
);

AdminPotatoVarietyGrown.hasMany(AdminPotatoSubVarietyGrown, {
  foreignKey: "varietyId",
  as: "adminPotatoVariety",
});

AdminPotatoSubVarietyGrown.belongsTo(AdminPotatoVarietyGrown, {
  foreignKey: "varietyId",
  as: "parentVariety",
});

export default AdminPotatoSubVarietyGrown;
