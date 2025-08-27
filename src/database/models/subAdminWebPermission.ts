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

class SubAdminWebPermission extends Model<
  InferAttributes<SubAdminWebPermission>,
  InferCreationAttributes<SubAdminWebPermission>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User["id"]>;
  declare module: string; // e.g. "farmer", "trader"
  declare action: string; // e.g. "view", "create", "update", "delete"
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SubAdminWebPermission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    module: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: "SubAdminWebPermission",
    tableName: "subAdminWebPermissions",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "module", "action"],
      },
    ],
  }
);

// Associations
User.hasMany(SubAdminWebPermission, {
  foreignKey: "userId",
  as: "webPermissions",
});
SubAdminWebPermission.belongsTo(User, { foreignKey: "userId", as: "user" });

export default SubAdminWebPermission;
