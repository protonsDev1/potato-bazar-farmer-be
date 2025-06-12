import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdminTechnologyUsed extends Model<
  InferAttributes<AdminTechnologyUsed>,
  InferCreationAttributes<AdminTechnologyUsed>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare isActive: boolean;
  declare position: number;
}

AdminTechnologyUsed.init(
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
    modelName: "AdminTechnologyUsed",
    tableName: "adminTechnologiesUsed",
    timestamps: true,
  }
);

export default AdminTechnologyUsed;
