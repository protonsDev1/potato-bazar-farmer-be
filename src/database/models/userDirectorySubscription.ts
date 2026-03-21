import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import User from "./user";
import DirectorySubscriptionPlan from "./directorySubscriptionPlan";

class UserDirectorySubscription extends Model {}

UserDirectorySubscription.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    userId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },

    planId: {
      type: DataTypes.INTEGER,
      references: { model: "directorySubscriptionPlans", key: "id" },
    },

    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,

    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
    },
  },
  {
    sequelize,
    tableName: "userDirectorySubscriptions",
    modelName: "UserDirectorySubscription",
  },
);

User.belongsToMany(DirectorySubscriptionPlan, {
  through: UserDirectorySubscription,
  foreignKey: "userId",
});

export default UserDirectorySubscription;
