import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from "sequelize";
  import sequelize from "./db";
import User from "./user";
  
  export enum TICKET_PRIORITY {
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High",
  }
  
  export enum TICKET_STATUS {
    OPEN = "Open",
    IN_PROGRESS = "In Progress",
    RESOLVED = "Resolved",
    CLOSED = "Closed",
  }
  
  class UserSupport extends Model<
    InferAttributes<UserSupport>,
    InferCreationAttributes<UserSupport>
  > {
    declare id: CreationOptional<number>;
    declare userId: number;
    declare subject: string;
    declare category: string;
    declare priority: TICKET_PRIORITY;
    declare status: TICKET_STATUS;
    declare reply: string | null; 
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  }
  
  UserSupport.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      priority: {
        type: DataTypes.ENUM(...Object.values(TICKET_PRIORITY)),
        allowNull: false,
        defaultValue: TICKET_PRIORITY.MEDIUM,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(TICKET_STATUS)),
        allowNull: false,
        defaultValue: TICKET_STATUS.OPEN,
      },
      reply: {
        type: DataTypes.TEXT,
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
      modelName: "UserSupport",
      tableName: "userSupport",
      timestamps: true,
    }
  );

  UserSupport.belongsTo(User, { foreignKey: "userId", as: "User" });
  User.hasMany(UserSupport, { foreignKey: "userId", as: "SupportTickets" });
  
  export default UserSupport;
  