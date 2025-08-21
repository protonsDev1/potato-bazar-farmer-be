import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import User from "./user";

export enum SELL_REQUEST_STATUS {
  AVAILABLE = "Available",
  RESERVED = "Reserved",
  SOLD = "Sold",
  EXPIRED = "Expired",
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
  declare status: SELL_REQUEST_STATUS;
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
      allowNull: true,
    },
    requiredByDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    qualityGrade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    packagingType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    delivery: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sugarContent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skinSet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fleshColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shape: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    soilAdherence: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firmness: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sproutingStatus: {
      type: DataTypes.STRING,
      allowNull: false,
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
      defaultValue: SELL_REQUEST_STATUS.AVAILABLE,
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
