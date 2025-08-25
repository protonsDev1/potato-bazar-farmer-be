import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class AgentMonthlyTarget extends Model<
  InferAttributes<AgentMonthlyTarget>,
  InferCreationAttributes<AgentMonthlyTarget>
> {
  declare id: CreationOptional<number>;
  declare agentUserId: number;
  declare year: number;
  declare month: string;
  declare farmerMonthlyTarget: number;
  declare coldStorageMonthlyTarget: number;
  declare traderMonthlyTarget: number;
  declare updatedAt?: Date;
  declare createdAt?: Date;
}

AgentMonthlyTarget.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    agentUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    farmerMonthlyTarget: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    coldStorageMonthlyTarget: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    traderMonthlyTarget: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AgentMonthlyTarget",
    tableName: "agentMonthlyTargets",
    timestamps: true,
  }
);

export default AgentMonthlyTarget;
