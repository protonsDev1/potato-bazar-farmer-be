import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import User from "./user";

export enum USER_TYPE {
  FARMER = "farmer",
  COLD_STORAGE = "cold_storage",
  TRADER = "trader",
}

class AgentOnboardedUser extends Model<
  InferAttributes<AgentOnboardedUser>,
  InferCreationAttributes<AgentOnboardedUser>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare agentId: number;
  declare userType:
    | USER_TYPE.FARMER
    | USER_TYPE.COLD_STORAGE
    | USER_TYPE.TRADER;
  declare userName: string;
  declare village: string;
  declare district: string;
  declare state: string;
  declare statusOfRegistration: string;
  declare updatedAt?: Date;
  declare createdAt?: Date;
}

AgentOnboardedUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    agentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
    },
    village: {
      type: DataTypes.STRING,
    },
    district: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    statusOfRegistration: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "AgentOnboardedUser",
    tableName: "agentOnboardedUsers",
    timestamps: true,
  }
);

export default AgentOnboardedUser;
