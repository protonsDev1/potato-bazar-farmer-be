// models/userNotificationSetting.ts
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import sequelize from "./db";
import User from "./user";

class UserNotificationSetting extends Model<
  InferAttributes<UserNotificationSetting>,
  InferCreationAttributes<UserNotificationSetting>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User["id"]>;
  declare allowAll: CreationOptional<boolean>;

  declare buy: CreationOptional<boolean>;
  declare sell: CreationOptional<boolean>;
  declare mandiPrice: CreationOptional<boolean>;
  declare broadcast: CreationOptional<boolean>;
  declare news: CreationOptional<boolean>;
  declare event: CreationOptional<boolean>;
  declare govScheme: CreationOptional<boolean>;
  declare coldStorage: CreationOptional<boolean>;
  declare knowledgeHub: CreationOptional<boolean>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

UserNotificationSetting.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      unique: true,
    },
    allowAll: { type: DataTypes.BOOLEAN, defaultValue: true },

    buy: { type: DataTypes.BOOLEAN, defaultValue: true },
    sell: { type: DataTypes.BOOLEAN, defaultValue: true },
    mandiPrice: { type: DataTypes.BOOLEAN, defaultValue: true },
    broadcast: { type: DataTypes.BOOLEAN, defaultValue: true },
    news: { type: DataTypes.BOOLEAN, defaultValue: true },
    event: { type: DataTypes.BOOLEAN, defaultValue: true },
    govScheme: { type: DataTypes.BOOLEAN, defaultValue: true },
    coldStorage: { type: DataTypes.BOOLEAN, defaultValue: true },
    knowledgeHub: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "UserNotificationSetting",
    tableName: "userNotificationSettings",
    timestamps: true,
    indexes: [{ fields: ["userId"] }],
  }
);

UserNotificationSetting.belongsTo(User, { foreignKey: "userId", as: "user" });

export default UserNotificationSetting;
