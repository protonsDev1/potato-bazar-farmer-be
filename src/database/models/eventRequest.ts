import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "./db";
import Event from "./event";
import User from "./user";

export enum EVENT_REQUEST_STATUS {
  PENDING = "pending",
  REJECTED = "rejected",
  APPROVED = "approved",
}

class EventRequest extends Model<
  InferAttributes<EventRequest>,
  InferCreationAttributes<EventRequest>
> {
  declare id: CreationOptional<number>;
  declare requestCreatedBy: number;
  declare eventId: number;
  declare status: string;
  declare mobile: string;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

EventRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    requestCreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: EVENT_REQUEST_STATUS.PENDING,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: "EventRequest",
    tableName: "eventRequests",
    timestamps: true,
    indexes: [
      {
        fields: ["status"],
      },
      {
        fields: ["eventId"],
      },
      {
        fields: ["requestCreatedBy"],
      },
      {
        unique: true,
        fields: ["requestCreatedBy", "eventId"],
      },
    ],
  }
);

EventRequest.belongsTo(User, { foreignKey: "requestCreatedBy", as: "requestedByUser" });
EventRequest.belongsTo(Event, { foreignKey: "eventId", as: "events" });

User.hasMany(EventRequest, { foreignKey: "requestCreatedBy" });
Event.hasMany(EventRequest, { foreignKey: "eventId" });

export default EventRequest;
