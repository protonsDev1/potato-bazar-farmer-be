import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import User from "./user";
import Notification from "./notification";

class Broadcast extends Model<
  InferAttributes<Broadcast>,
  InferCreationAttributes<Broadcast>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare senderId: number | null;
  declare audience: object;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Broadcast.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    audience: {
      type: DataTypes.JSONB,
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
    modelName: "Broadcast",
    tableName: "broadcasts",
    timestamps: true,
  }
);

// Associations
Broadcast.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
});

Notification.belongsTo(Broadcast, {
  foreignKey: "broadcastId",
  as: "broadcast",
});

Broadcast.hasMany(Notification, {
  foreignKey: "broadcastId",
  as: "notifications",
});

export default Broadcast;
