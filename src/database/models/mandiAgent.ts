import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import User from "./user";

class MandiAgent extends Model<
  InferAttributes<MandiAgent>,
  InferCreationAttributes<MandiAgent>
> {
  declare id: number;
  declare userId: number;
  declare licenseNumber: string;
  declare remarks: string;
  declare isActive: boolean;
  declare isDeleted: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare user?: User;
}

MandiAgent.init(
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
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: "MandiAgent",
    tableName: "mandiAgents",
    timestamps: true,
    indexes: [
      { fields: ["isDeleted"] },
      { fields: ["userId"] },
      { unique: true, fields: ["licenseNumber"] },
    ],
  }
);

MandiAgent.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(MandiAgent, { foreignKey: "userId", as: "mandiAgentProfile" });

export default MandiAgent;
