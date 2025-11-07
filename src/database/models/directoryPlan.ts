import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class DirectoryPlan extends Model<
  InferAttributes<DirectoryPlan>,
  InferCreationAttributes<DirectoryPlan>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare priority: number;
  declare homePagePosition: string | null;
  declare categoryPagePosition: string | null;
  declare slotLimit: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

DirectoryPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    homePagePosition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryPagePosition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slotLimit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "DirectoryPlan",
    tableName: "directoryPlans",
    timestamps: true,
  }
);

export default DirectoryPlan;
