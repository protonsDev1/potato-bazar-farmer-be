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
import RequestView from "./requestView";

export enum SELL_REQUEST_STATUS {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
}

class SellRequest extends Model<
  InferAttributes<SellRequest>,
  InferCreationAttributes<SellRequest>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare requestId: string;
  declare potatoType: string;
  declare potatoVariety: string;
  declare quantity: number;
  declare unit: string;
  declare targetPrice: number | null;
  declare minOrderQuantity: string | null;
  declare qualityGrade: string | null;
  declare packagingType: string | null;
  declare delivery: string | null;
  declare size: string | null;
  declare sugarContent: string | null;
  declare skinSet: string | null;
  declare fleshColor: string | null;
  declare shape: string | null;
  declare soilAdherence: string | null;
  declare firmness: string | null;
  declare sproutingStatus: string | null;
  declare skinColor: string | null;
  declare tpod: number | null;
  declare uc: number | null;
  declare tuberSize: string | null;
  declare dryMatter: string | null;
  declare healthCondition: string | null;
  declare additionalComment: string | null;
  declare storageTemperature: string | null;
  declare brand: string | null;
  declare generation: string | null;
  declare treatmentStatus: string | null;
  declare seedSourceType: string | null;
  declare sproutingCondition: string | null;
  declare physicalCondition: string | null;
  declare roguingStatus: string | null;
  declare perTubeWeight: string | null;
  declare diseaseFreeCertified: string | null;
  declare productionMethod: string | null;
  declare productionDate: Date | null;
  declare organicCertified: boolean;
  declare isVerified: boolean;
  declare status: SELL_REQUEST_STATUS;
  declare reason: string | null;
  declare images?: string[];
  declare location?: string;
  declare isAdminVerified: boolean;
  declare isActive: boolean;
  declare shapeType: string | null;
  declare sellFavourites?: FavouriteRequest[];
  declare views?: RequestView[];
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SellRequest.init(
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
    minOrderQuantity: {
      type: DataTypes.STRING,
    },
    qualityGrade: {
      type: DataTypes.STRING,
    },
    packagingType: {
      type: DataTypes.STRING,
    },
    delivery: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.STRING,
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
    skinColor: {
      type: DataTypes.STRING,
    },
    tpod: {
      type: DataTypes.FLOAT,
    },
    uc: {
      type: DataTypes.FLOAT,
    },
    tuberSize: {
      type: DataTypes.STRING,
    },
    dryMatter: {
      type: DataTypes.STRING,
    },
    healthCondition: {
      type: DataTypes.STRING,
    },
    additionalComment: {
      type: DataTypes.TEXT,
    },
    storageTemperature: {
      type: DataTypes.STRING,
    },
    brand: {
      type: DataTypes.STRING,
    },
    generation: {
      type: DataTypes.STRING,
    },
    treatmentStatus: {
      type: DataTypes.STRING,
    },
    seedSourceType: {
      type: DataTypes.STRING,
    },
    sproutingCondition: {
      type: DataTypes.STRING,
    },
    physicalCondition: {
      type: DataTypes.STRING,
    },
    roguingStatus: {
      type: DataTypes.STRING,
    },
    perTubeWeight: {
      type: DataTypes.STRING,
    },
    diseaseFreeCertified: {
      type: DataTypes.STRING,
      defaultValue: false,
    },
    productionMethod: {
      type: DataTypes.STRING,
    },
    productionDate: {
      type: DataTypes.DATE,
    },
    organicCertified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: SELL_REQUEST_STATUS.PENDING,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAdminVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    shapeType: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    modelName: "SellRequest",
    tableName: "sellRequests",
    timestamps: true,
  }
);

// Associations
SellRequest.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(SellRequest, { foreignKey: "userId", as: "sellRequests" });

export default SellRequest;
