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

class SubAdminPermission extends Model<
  InferAttributes<SubAdminPermission>,
  InferCreationAttributes<SubAdminPermission>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User["id"]>;
  declare permission: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SubAdminPermission.init(
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
    permission: {
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
    modelName: "SubAdminPermission",
    tableName: "subAdminPermissions",
    timestamps: true,
  }
);

// Association
User.hasMany(SubAdminPermission, { foreignKey: "userId", as: "permissions" });
SubAdminPermission.belongsTo(User, { foreignKey: "userId", as: "user" });

export default SubAdminPermission;
