import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import User from "./user";

export enum OPEN_MARKET_STATUS {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
}

export enum OPEN_MARKET_CATEGORY {
  EQUIPMENT_OR_MACHINERY = "equipment_or_machinery",
  SERVICES = "services",
  PACKING_OR_HANDLING_MATERIALS = "packing_or_handling_materials",
  CONTRACT_FARMING = "contract_farming",
  LAND_OR_LEASE = "land_or_lease",
}

class OpenMarketPlace extends Model<
  InferAttributes<OpenMarketPlace>,
  InferCreationAttributes<OpenMarketPlace>
> {
  declare id: CreationOptional<number>;
  declare category: string;
  declare machineryCategory: string | null;
  declare equipmentType: string | null;
  declare brandName: string | null;
  declare modelName: string | null;
  declare condition: string | null;
  declare yearOfPurchase: string | null;
  declare expectedPrice: string | null;

  declare serviceCategory: string | null;
  declare serviceCoverageArea: string | null;
  declare serviceUnit: string | null;
  declare serviceChargesPerUnit: number | null;

  declare packaging: string | null;
  declare materialType: string | null;
  declare bagSize: string | null;
  declare packagingUnit: string | null;
  declare packagingUnitRate: number | null;
  declare delivery: string | null;

  declare typeOfFarming: string | null;
  declare potatoVariety: string[];
  declare contractType: string | null;
  declare contractUnit: string | null;
  declare contractUnitRate: number | null;
  declare fromMonth: string | null;
  declare toMonth: string | null;
  declare paymentTerms: string | null;
  declare contractFarmingRegion: string | null;
  declare areaUnit: string | null;
  declare totalArea: number | null;
  declare landOrLeaseContractType: string | null;
  declare numberOfYears: number | null;
  declare numberOfMonths: number | null;
  declare irrigationAvailability: boolean | null;
  declare soilType: string | null;

  declare description: string | null;
  declare state: string | null;
  declare district: string | null;
  declare locationOrCity: string | null;
  declare pinCodeOrDigiPin: string | null;
  declare nameOrCompanyName: string | null;
  declare email: string | null;
  declare phoneNumber: string | null;
  declare whatsappNumber: string | null;
  declare alternatePhoneNumber: string | null;
  declare attachments: string[];
  declare status: string;
  declare createdBy: User;
}

OpenMarketPlace.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    machineryCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    equipmentType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    brandName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    modelName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    yearOfPurchase: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expectedPrice: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    serviceCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serviceCoverageArea: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    serviceUnit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serviceChargesPerUnit: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },

    packaging: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    materialType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bagSize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    packagingUnit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    packagingUnitRate: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    delivery: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    typeOfFarming: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    potatoVariety: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    contractType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contractUnit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contractUnitRate: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    fromMonth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    toMonth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentTerms: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contractFarmingRegion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    areaUnit: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    totalArea: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    landOrLeaseContractType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numberOfYears: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    numberOfMonths: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    irrigationAvailability: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    soilType: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    locationOrCity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pinCodeOrDigiPin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nameOrCompanyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    whatsappNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alternatePhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    status: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  },
  {
    sequelize,
    modelName: "OpenMarketPlace",
    tableName: "openMarketPlaces",
    timestamps: true,
  }
);

export default OpenMarketPlace;
