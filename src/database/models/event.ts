import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "./db";

export enum EVENT_STATUS {
  PENDING = "pending",
  REJECTED = "rejected",
  APPROVED = "approved",
}

class Event extends Model<
  InferAttributes<Event>,
  InferCreationAttributes<Event>
> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare mobile: string;
  declare ownerName: string;
  declare image: string;
  declare title: string;
  declare description: Text;
  declare startDate: CreationOptional<Date>;
  declare endDate: CreationOptional<Date>;
  declare startTime: string;
  declare endTime: string;
  declare location: string;
  declare document: string;
  declare website: string;
  declare status: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    document: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: EVENT_STATUS.PENDING,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Event",
    tableName: "events",
    timestamps: true,
    indexes: [
      {
        fields: ["status"],
      },
      {
        fields: ["startDate", "endDate"],
      },
      {
        fields: ["location"],
      },
      {
        fields: ["email"],
      },
      {
        fields: ["mobile"],
      },
    ],
  }
);

export default Event;
