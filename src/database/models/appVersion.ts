import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class AppVersions extends Model<
  InferAttributes<AppVersions>,
  InferCreationAttributes<AppVersions>
> {
  declare id: CreationOptional<number>;
  declare deviceType: "android" | "ios";
  declare version: string;
  declare versionCode: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare isForceUpdateEnabled: CreationOptional<boolean>;
}

AppVersions.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    deviceType: {
      type: DataTypes.ENUM("android", "ios"),
      allowNull: false,
    },

    version: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    versionCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    isForceUpdateEnabled:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  },
  {
    sequelize,
    modelName: "AppVersions",
    tableName: "appVersions",
    timestamps: true,
  }
);

export default AppVersions;
