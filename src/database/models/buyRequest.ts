import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import User from "./user";
import FavouriteRequest from "./favouriteRequest";

export enum BUY_REQUEST_STATUS {
  ACTIVE = "Active",
  PENDING = "Pending",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

class BuyRequest extends Model<
  InferAttributes<BuyRequest>,
  InferCreationAttributes<BuyRequest>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare requestId: string;
  declare potatoType: string;
  declare potatoVariety: string;
  declare quantity: number;
  declare unit: string;
  declare targetPrice: number | null;
  declare requiredByDate: Date | null;
  declare qualityGrade: string;
  declare packagingType: string | null;
  declare delivery: string | null;
  declare size: number | null;
  declare sugarContent: string;
  declare skinSet: string;
  declare fleshColor: string;
  declare shape: string;
  declare soilAdherence: string;
  declare firmness: string;
  declare sproutingStatus: string;
  declare organicCerified: boolean;
  declare isVerified: boolean;
  declare status: BUY_REQUEST_STATUS;
  declare buyFavourites?: FavouriteRequest[];
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

BuyRequest.init(
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
    requestId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    potatoType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    potatoVariety: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetPrice: {
      type: DataTypes.FLOAT,
    },
    requiredByDate: {
      type: DataTypes.DATE,
    },
    qualityGrade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    packagingType: {
      type: DataTypes.STRING,
    },
    delivery: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.FLOAT,
    },
    sugarContent: {
      type: DataTypes.STRING,
    },
    skinSet: {
      type: DataTypes.STRING,
    },
    fleshColor: {
      type: DataTypes.STRING,
    },
    shape: {
      type: DataTypes.STRING,
    },
    soilAdherence: {
      type: DataTypes.STRING,
    },
    firmness: {
      type: DataTypes.STRING,
    },
    sproutingStatus: {
      type: DataTypes.STRING,
    },
    organicCerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: BUY_REQUEST_STATUS.PENDING,
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
    modelName: "BuyRequest",
    tableName: "buyRequests",
    timestamps: true,
  }
);

// Associations
BuyRequest.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(BuyRequest, { foreignKey: "userId", as: "buyRequests" });

export default BuyRequest;
