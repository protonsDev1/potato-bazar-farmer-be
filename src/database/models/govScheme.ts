import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

export enum GOVERNMENT_TYPE {
  CENTRAL_GOVERNMENT = "Central",
  STATE_GOVERNMENT = "State",
}

export enum GOV_SCHEME_CATEGORY {
  FARM_RELATED = "Farm Related",
  COLD_STORAGE = "Cold Storage",
  AGRICULTURE = "Agriculture",
  INSURANCE = "Insurance",
  SUBSIDY = "Subsidy",
  LOAN = "Loan",
  TRAINING = "Training",
  TECHNOLOGY = "Technology",
  MARKETING = "Marketing",
  STORAGE = "Storage",
  PROCESSING_RELATED = "Processing Related",
  EXPORT = "Export",
}

class GovernmentScheme extends Model<
  InferAttributes<GovernmentScheme>,
  InferCreationAttributes<GovernmentScheme>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare category: string;
  declare governmentType: string; // "Central" or "State"
  declare state: string | null;
  declare description: string;
  declare startDate: Date;
  declare endDate: Date;
  declare document: string | null;
  declare mobile: string;
  declare email: string;
  declare websiteUrl: string | null;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

GovernmentScheme.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    governmentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    document: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    websiteUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
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
    modelName: "GovernmentScheme",
    tableName: "governmentSchemes",
    timestamps: true,
  }
);

export default GovernmentScheme;
