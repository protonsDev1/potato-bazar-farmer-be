import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import User from "./user";

class ContactUnlock extends Model {}

ContactUnlock.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    userId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },

    ownerUserId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },

    module: DataTypes.STRING,

    recordId: DataTypes.INTEGER,

    price: DataTypes.DECIMAL(10, 2),

    paymentSource: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "contactUnlocks",
  },
);

User.hasMany(ContactUnlock, { foreignKey: "userId", as: "unlocks" });

export default ContactUnlock;
