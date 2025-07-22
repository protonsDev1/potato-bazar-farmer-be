import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import User from "./user";

export enum PriorityEnum {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum StatusEnum {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
}

class HelpAndSupport extends Model<
  InferAttributes<HelpAndSupport>,
  InferCreationAttributes<HelpAndSupport>
> {
  declare id: CreationOptional<number>;
  declare ticketId: string;
  declare subject: string;
  declare description: string;
  declare priority: PriorityEnum;
  declare reply: string;
  declare status: StatusEnum;
  declare agentId: number;
}

HelpAndSupport.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ticketId: { type: DataTypes.STRING, allowNull: true, unique: true },
    subject: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: PriorityEnum.LOW,
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: StatusEnum.OPEN,
    },
    agentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "HelpAndSupport",
    tableName: "helpAndSupport",
    timestamps: true,
  }
);

export default HelpAndSupport;
