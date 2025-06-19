import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import User from "./user";

class Agent extends Model {
  public agentId!: string;
  public user?: User;
  public phone: string;
  public address: string;
  public district: string;
  public note: string;
  public isActive: boolean;
  public isDeleted: boolean;
}

Agent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    agentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: "Agent",
    tableName: "agents",
    timestamps: true,
    indexes: [{ fields: ["isDeleted"] }],
  }
);

// Associations
Agent.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Agent, { foreignKey: "userId", as: "agentProfile" });

export default Agent;
