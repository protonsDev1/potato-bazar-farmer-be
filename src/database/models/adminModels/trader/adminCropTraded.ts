import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../../db";

class AdminCropTraded extends Model<
  InferAttributes<AdminCropTraded>,
  InferCreationAttributes<AdminCropTraded>
> {
  declare id: CreationOptional<number>;
  declare cropName: string;
  declare isActive: CreationOptional<boolean>;
  declare position: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AdminCropTraded.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cropName: { type: DataTypes.STRING(100), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AdminCropTraded",
    tableName: "adminCropsTraded",
    timestamps: true,
  }
);

export default AdminCropTraded;
