import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdminPotatoDisposalSystem extends Model<
  InferAttributes<AdminPotatoDisposalSystem>,
  InferCreationAttributes<AdminPotatoDisposalSystem>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare isActive: boolean;
  declare position: number;
}

AdminPotatoDisposalSystem.init(
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
    modelName: "AdminPotatoDisposalSystem",
    tableName: "adminPotatoDisposalSystems",
    timestamps: true,
  }
);

export default AdminPotatoDisposalSystem;
