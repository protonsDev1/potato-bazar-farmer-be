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
  declare userId: number;
  declare eventId: number;
  declare status: string;
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
    userId: {
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
        fields: ["userId"],
      },
      {
        unique: true,
        fields: ["userId", "eventId"],
      },
    ],
  }
);

EventRequest.belongsTo(User, { foreignKey: "userId", as: "users"});
EventRequest.belongsTo(Event, { foreignKey: "eventId", as: "events"});

User.hasMany(EventRequest, { foreignKey: "userId" });
Event.hasMany(EventRequest, { foreignKey: "eventId" });

export default EventRequest;
