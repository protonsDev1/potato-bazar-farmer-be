import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

export enum MOBILE_TYPE {
  PRIMARY = "primary",
  SECONDARY = "secondary",
}

class MobileUpdateSession extends Model<
  InferAttributes<MobileUpdateSession>,
  InferCreationAttributes<MobileUpdateSession>
> {
  declare id: number;
  declare userId: number;
  declare type: string;
  declare currentMobile: string;
  declare currentNumberLastVerifiedAt: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MobileUpdateSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currentMobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentNumberLastVerifiedAt: {
      type: DataTypes.DATE,
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
  { sequelize, modelName: "mobileUpdateSessions" }
);

export default MobileUpdateSession;
