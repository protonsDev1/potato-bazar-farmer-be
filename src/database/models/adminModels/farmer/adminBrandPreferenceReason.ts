import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdminBrandPreferenceReason extends Model<
  InferAttributes<AdminBrandPreferenceReason>,
  InferCreationAttributes<AdminBrandPreferenceReason>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare isActive: boolean;
  declare position: number;
}

AdminBrandPreferenceReason.init(
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
    modelName: "AdminBrandPreferenceReason",
    tableName: "adminBrandPreferenceReasons",
    timestamps: true,
  }
);

export default AdminBrandPreferenceReason;
