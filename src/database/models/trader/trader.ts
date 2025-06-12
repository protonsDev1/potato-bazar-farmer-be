import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import sequelize from "../db";
import User from "../user";

class Trader extends Model<
  InferAttributes<Trader>,
  InferCreationAttributes<Trader>
> {
  declare id: CreationOptional<number>;
  declare fullName: string;
  declare businessName: string;
  declare mobileNumber: string;
  declare whatsappNumber: string | null;
  declare email: string | null;
  declare state: string;
  declare district: string;
  declare cityOrVillage: string;
  declare pinCode: string;
  declare languagePreference: string;
  declare companyRegisteredVendor: boolean;
  declare mainCompany: string | null;
  declare numberOfEmployees: string;
  declare ownPotatoFarming: boolean;
  declare acres: number | null;
  declare yearlyPurchaseVolumeTons: number;
  declare mainProcurementRegion: string;
  declare geographicalMarketCovered: string;
  declare contractFarming: boolean;
  declare spotBuying: boolean;
  declare seedsSales: boolean;
  declare ownColdStorage: boolean;
  declare yearsInTrading: string;
  declare averageDailySalesKatta: number;
  declare salesOwnPotatoes: boolean;
  declare onlineAuctionInterest: boolean;
  declare bankLoanFacility: boolean;
  declare coldStorageAccess: boolean;
  declare acceptsOnlinePayments: boolean;
  declare panNumber: string;
  declare gstNumber: string | null;
  declare fssaiNumber: string | null;
  declare userId: ForeignKey<User["id"]> | null;
  declare onBoardedBy: ForeignKey<User["id"]> | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Trader.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    whatsappNumber: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cityOrVillage: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    pinCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    languagePreference: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    companyRegisteredVendor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mainCompany: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numberOfEmployees: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ownPotatoFarming: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    acres: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    yearlyPurchaseVolumeTons: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    mainProcurementRegion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    geographicalMarketCovered: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contractFarming: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    spotBuying: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    seedsSales: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ownColdStorage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    yearsInTrading: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    averageDailySalesKatta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    salesOwnPotatoes: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    onlineAuctionInterest: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    bankLoanFacility: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    coldStorageAccess: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    acceptsOnlinePayments: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    panNumber: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    gstNumber: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    fssaiNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    onBoardedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
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
  },
  {
    sequelize,
    modelName: "Trader",
    tableName: "traders",
    timestamps: true,
  }
);

export default Trader;
