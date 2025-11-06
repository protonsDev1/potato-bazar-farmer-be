import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';
import StorageType from './storageType';
import User, { REGISTRATION_STATUS } from './user';

class ColdStorage extends Model<InferAttributes<ColdStorage>, InferCreationAttributes<ColdStorage>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare firstName: string;
  declare lastName: string;
  declare ownerName: string;
  declare mobileNumber: string;
  declare optionalNumber: string;
  declare whatsappNumber: string;
  declare village: string;
  declare district: string;
  declare taluka: string;
  declare pinCode: string;
  declare digiPin: string;
  declare geoLocation: string;
  declare hasGstCertificate: boolean;
  declare gstOrCertificateNumber: string;
  declare totalCapacityMt: number;
  declare builtYear: number;
  declare constructionType: string;
  declare roofType: string;
  declare numberOfChambers: number;
  declare floorsPerChamber: number;
  declare chamberWiseCapacityMt: string;
  declare numberOfSheds: number;
  declare shedSize: string;
  declare antiChamberSizeCapacity: string;
  declare totalArea: string;
  declare hasAirCutter: boolean;
  declare hasInsectTrap: boolean;
  declare gradingBookingAvailable: boolean;
  declare gradingAreaAvailable: boolean;
  declare gradingAreaSqft: number;
  declare gradingMachineMake: string;
  declare gradingMachineAvailable:boolean;
  declare gradingMachineTph: number;
  declare manualGradingAreaAvailable: boolean;
  declare numberOfKattas:number;
  declare dryingFloorCapacityKatta: number;
  declare bookingMode: string;
  declare coldStorageType: string;
  declare co2Controller: string;
  declare humidityController: string;
  declare temperatureController: string;
  declare monitoringLogAvailable: boolean;
  declare realTimeAlertSystem: boolean;
  declare refrigerationType: string;
  declare refrigerationMake: string;
  declare machineCount: number;
  declare machineCapacityArray: number[]; 
  declare machineCapacity: number;
  declare machineMake: string;
  declare hasAmmoniaDetector: boolean;
  declare hasRemoteMonitoring: boolean;
  declare hasWebCamera: boolean;
  declare hasGuestStay: boolean;
  declare hasGuestMeals: boolean;
  declare weighBridge: boolean;
  declare weighbridgeCapacityLength: string;
  declare hasLorryShades: boolean;
  declare lorryShadeCapacity: number;
  declare numberOfTrucks: number;
  declare accessibility: string;
  declare hasLabourForGrading: boolean;
  declare noOfLabourInPeakSeason: number;
  declare potatoDisposalMethod: string;
  declare solarPowerCapacityKw: number;
  declare backupPowerCapacityKw: number;
  declare uniqueFeatures: string;
  declare tradeMode: 'yesTradeOnly' | 'noRentalOnly' | 'bothTradeAndRent';
  declare isContractFarming: boolean;
  declare contractFarmingDetails: string;
  declare transportProvided: boolean;
  declare willingOnlineAuction: boolean;
  declare additionalComments: string;
  declare isSlabWiseDiscount: boolean;
  declare gradingCharges: number;
  declare otherCharges: number;
  declare awardOrCertificate: string;
  declare photos: string;
  declare onBoardedBy: number | null;
  declare userId: number | null;
  declare state: string;
  declare isDeleted: boolean;
  declare status: string;
  declare reason: Text;
  declare isAvailable: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare user?:User;
}

ColdStorage.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING,
  firstName: { type: DataTypes.STRING, allowNull: true },
  lastName: { type: DataTypes.STRING, allowNull: true },
  ownerName: DataTypes.STRING,
  mobileNumber: DataTypes.STRING,
  optionalNumber: DataTypes.STRING,
  whatsappNumber: DataTypes.STRING,
  village: DataTypes.STRING,
  district: DataTypes.STRING,
  taluka: DataTypes.STRING,
  pinCode:{type: DataTypes.STRING, allowNull: true},
  digiPin: {type: DataTypes.STRING, allowNull: true},
  geoLocation: DataTypes.STRING,
  hasGstCertificate: DataTypes.BOOLEAN,
  gstOrCertificateNumber: DataTypes.STRING,
  totalCapacityMt: DataTypes.DECIMAL,
  builtYear: DataTypes.INTEGER,
  constructionType: DataTypes.STRING,
  roofType: DataTypes.STRING,
  numberOfChambers: DataTypes.INTEGER,
  floorsPerChamber: DataTypes.INTEGER,
  chamberWiseCapacityMt: DataTypes.TEXT,
  numberOfSheds: DataTypes.INTEGER,
  shedSize: DataTypes.STRING,
  antiChamberSizeCapacity: DataTypes.TEXT,
  totalArea: DataTypes.STRING,
  hasAirCutter: DataTypes.BOOLEAN,
  hasInsectTrap: DataTypes.BOOLEAN,
  gradingBookingAvailable: DataTypes.BOOLEAN,
  gradingAreaAvailable: DataTypes.BOOLEAN,
  gradingAreaSqft: DataTypes.DECIMAL,
  gradingMachineMake: DataTypes.STRING,
  gradingMachineAvailable:DataTypes.BOOLEAN,
  gradingMachineTph: DataTypes.DECIMAL,
  manualGradingAreaAvailable: DataTypes.BOOLEAN,
  numberOfKattas: DataTypes.INTEGER,
  dryingFloorCapacityKatta: DataTypes.INTEGER,
  bookingMode: DataTypes.STRING,
  coldStorageType: DataTypes.STRING,
  co2Controller: DataTypes.STRING,
  humidityController: DataTypes.STRING,
  temperatureController: DataTypes.STRING,
  monitoringLogAvailable: DataTypes.BOOLEAN,
  realTimeAlertSystem: DataTypes.BOOLEAN,
  refrigerationType: DataTypes.STRING,
  refrigerationMake: DataTypes.STRING,
  machineCount: DataTypes.INTEGER,
  machineCapacityArray: {
     type: DataTypes.ARRAY(DataTypes.DECIMAL),
      allowNull: true,
  },
  machineCapacity: DataTypes.DECIMAL,
  machineMake: DataTypes.STRING,
  hasAmmoniaDetector: DataTypes.BOOLEAN,
  hasRemoteMonitoring: DataTypes.BOOLEAN,
  hasWebCamera: DataTypes.BOOLEAN,
  hasGuestStay: DataTypes.BOOLEAN,
  hasGuestMeals: DataTypes.BOOLEAN,
  weighBridge: DataTypes.BOOLEAN,
  weighbridgeCapacityLength: DataTypes.STRING,
  hasLorryShades: DataTypes.BOOLEAN,
  lorryShadeCapacity: DataTypes.INTEGER,
  numberOfTrucks: DataTypes.INTEGER,
  accessibility: DataTypes.TEXT,
  hasLabourForGrading: DataTypes.BOOLEAN,
  noOfLabourInPeakSeason: DataTypes.INTEGER,
  potatoDisposalMethod: DataTypes.TEXT,
  solarPowerCapacityKw: DataTypes.DECIMAL,
  backupPowerCapacityKw: DataTypes.DECIMAL,
  uniqueFeatures: DataTypes.TEXT,
  tradeMode: DataTypes.ENUM('yesTradeOnly', 'noRentalOnly', 'bothTradeAndRent'),
  isContractFarming: DataTypes.BOOLEAN,
  contractFarmingDetails: DataTypes.TEXT,
  transportProvided: DataTypes.BOOLEAN,
  willingOnlineAuction: DataTypes.BOOLEAN,
  additionalComments: DataTypes.TEXT,
  state: DataTypes.STRING,
  isSlabWiseDiscount: DataTypes.BOOLEAN,
  gradingCharges: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
  otherCharges: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
  awardOrCertificate: {
       type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
  photos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
  onBoardedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  userId:{
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: REGISTRATION_STATUS.PENDING
  },
  reason: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  
}, {
  sequelize,
  modelName: 'ColdStorage',
  tableName: 'coldStorages',
  timestamps: true,
  indexes: [{ fields: ["isDeleted"] }],
});

ColdStorage.hasMany(StorageType, {
  foreignKey: 'coldStorageId',
  as: 'storageTypes',
});

StorageType.belongsTo(ColdStorage, {
  foreignKey: 'coldStorageId',
});

ColdStorage.belongsTo(User, { foreignKey: "userId", as: "user" });
ColdStorage.belongsTo(User, { foreignKey: "onBoardedBy", as: "onBoardedByUser" });

export default ColdStorage;
