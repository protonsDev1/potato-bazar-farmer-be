import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import User from "./user";

export enum NotificationType {
  BUY = "BUY",
  SELL = "SELL",
  MANDI_PRICE = "MANDI_PRICE",
  BROADCAST = "BROADCAST",
  NEWS = "NEWS",
  EVENT = "EVENT",
  GOV_SCHEME = "GOV_SCHEME",
  KYC = "KYC",
  USER_PB_VERIFICATION = "USER_PB_VERIFICATION",
  COLD_STORAGE = "COLD_STORAGE",
  FARMER = "FARMER",
  TRADER = "TRADER",
  ADVERTISEMENT = "ADVERTISEMENT",
  ASK_EXPERT = "ask_expert",
  KNOWLEDGE_HUB = "knowledge_hub",
}

class Notification extends Model<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare receiverId: number;
  declare senderId: number | null;
  declare referenceType: string;
  declare referenceId: number;
  declare isRead: boolean;
  declare isMatchingCase: boolean;
  declare broadcastId: number | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Notification.init(
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
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    referenceId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    referenceType: {
      type: DataTypes.STRING, // e.g. 'BuyRequest', 'SellRequest', 'Event'
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isMatchingCase: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    broadcastId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "broadcasts", key: "id" },
      onDelete: "SET NULL",
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
    modelName: "Notification",
    tableName: "notifications",
    timestamps: true,
    indexes: [
      {
        fields: ["receiverId", "isRead"],
      },
    ],
  }
);

// Associations
Notification.belongsTo(User, {
  foreignKey: "receiverId",
  as: "receiver",
});

Notification.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
});

export default Notification;
