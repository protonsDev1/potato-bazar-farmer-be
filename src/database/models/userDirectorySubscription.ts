import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import User from "./user";
import DirectorySubscriptionPlan from "./directorySubscriptionPlan";

class UserDirectorySubscription extends Model {
  declare id: number;
  declare userId: number;
  declare planId: number;
  declare startDate: Date;
  declare endDate: Date;
  declare status: string;
}

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

DirectorySubscriptionPlan.hasMany(UserDirectorySubscription, {
  foreignKey: "planId",
  as: "subscriptions",
});

UserDirectorySubscription.belongsTo(DirectorySubscriptionPlan, {
  foreignKey: "planId",
  as: "plan",
});

export default UserDirectorySubscription;
