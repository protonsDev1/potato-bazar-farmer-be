import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import User from "./user";
import InterestRequest from "./interestRequest";
import LikeCSRequirement from "./likeCSRequirement";

class ColdStorageRequirement extends Model<
  InferAttributes<ColdStorageRequirement>,
  InferCreationAttributes<ColdStorageRequirement>
> {
  declare id: CreationOptional<number>;
  declare requirementUid: string;
  declare location: string;
  declare district: string | null;
  declare state: string | null;
  declare verified: boolean;
  declare quantity: string | null;
  declare commodityType: string | null;
  declare storageTypes: string[] | null;
  declare bagTypes: string[] | null;
  declare duration: string | null;
  declare requiredFromDate: Date | null;
  declare preferredLocation: boolean;
  declare specialcoldStorageRequirements: string | null;
  declare isActive: boolean;
  declare createdBy: number;
  declare likes?: LikeCSRequirement[];
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ColdStorageRequirement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    requirementUid: { type: DataTypes.STRING, allowNull: false, unique: true },
    location: { type: DataTypes.STRING },
    district: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    quantity: {
      type: DataTypes.STRING,
    },
    commodityType: {
      type: DataTypes.STRING,
    },
    storageTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    bagTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    duration: {
      type: DataTypes.STRING,
    },
    requiredFromDate: {
      type: DataTypes.DATE,
    },
    preferredLocation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    specialcoldStorageRequirements: {
      type: DataTypes.TEXT,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
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
    modelName: "ColdStorageRequirement",
    tableName: "coldStorageRequirements",
    timestamps: true,
  }
);

// Associations
ColdStorageRequirement.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});
InterestRequest.belongsTo(ColdStorageRequirement, {
  foreignKey: "requirementId",
  as: "requirement",
});
ColdStorageRequirement.hasMany(InterestRequest, {
  foreignKey: "requirementId",
  as: "interestRequests",
});

export default ColdStorageRequirement;
