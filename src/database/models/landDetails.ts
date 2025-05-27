import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';

class LandDetail extends Model<InferAttributes<LandDetail>, InferCreationAttributes<LandDetail>> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare landOwnedAcres: number | null;
  declare landLeasedAcres: number | null;
  declare potatoCultivationAcres: number | null;
  declare irrigationEquipmentBrand: string | null;
  declare soilType: string | null;
  declare averageYieldPerAcre: number | null;
  declare sowingMonth: string | null;
  declare sowingMethod: string | null;
  declare storageFacilityAtFarm: boolean | null;
  declare primarySalesPoint: string | null;
  declare distanceToNearestMandi: string | null;
  declare isGradingMachineAtFarm: boolean | null;
  declare isShadeAtFarmGate: boolean | null;
  declare isUnderContractFarming: boolean | null;
  declare contractPercent: number | null;
  declare spotPercent: number | null;
  declare contractPartnerName: string | null;
  declare newSeedsPurchasedAnnually: boolean | null;
  declare reusedSeedsPercent: number | null;
  declare trustedSeedCompany: string | null;
  declare reasonForTrust: string | null;
  declare preference: string | null;
  declare contractFarmingPercent: number | null;
  declare soldInSpotMarketPercent: number | null;
  declare interestedInDigitalTrading: boolean | null;
  declare usesWhatsappForBusiness: boolean | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

LandDetail.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmerId: {
      type: DataTypes.INTEGER,
      references: { model: 'Farmers', key: 'id' },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    landOwnedAcres: { type: DataTypes.FLOAT, allowNull: true },
    landLeasedAcres: { type: DataTypes.FLOAT, allowNull: true },
    potatoCultivationAcres: { type: DataTypes.FLOAT, allowNull: true },
    irrigationEquipmentBrand: { type: DataTypes.STRING, allowNull: true },
    soilType: { type: DataTypes.STRING, allowNull: true },
    averageYieldPerAcre: { type: DataTypes.FLOAT, allowNull: true },
    sowingMonth: { type: DataTypes.STRING, allowNull: true },
    sowingMethod: { type: DataTypes.STRING, allowNull: true },
    storageFacilityAtFarm: { type: DataTypes.BOOLEAN, allowNull: true },
    primarySalesPoint: { type: DataTypes.STRING, allowNull: true },
    distanceToNearestMandi: { type: DataTypes.STRING, allowNull: true },
    isGradingMachineAtFarm: { type: DataTypes.BOOLEAN, allowNull: true },
    isShadeAtFarmGate: { type: DataTypes.BOOLEAN, allowNull: true },
    isUnderContractFarming: { type: DataTypes.BOOLEAN, allowNull: true },
    contractPercent: { type: DataTypes.FLOAT, allowNull: true },
    spotPercent: { type: DataTypes.FLOAT, allowNull: true },
    contractPartnerName: { type: DataTypes.STRING, allowNull: true },
    newSeedsPurchasedAnnually: { type: DataTypes.BOOLEAN, allowNull: true },
    reusedSeedsPercent: { type: DataTypes.FLOAT, allowNull: true },
    trustedSeedCompany: { type: DataTypes.STRING, allowNull: true },
    reasonForTrust: { type: DataTypes.TEXT, allowNull: true },
    preference: { type: DataTypes.TEXT, allowNull: true },
    contractFarmingPercent: { type: DataTypes.FLOAT, allowNull: true },
    soldInSpotMarketPercent: { type: DataTypes.FLOAT, allowNull: true },
    interestedInDigitalTrading: { type: DataTypes.BOOLEAN, allowNull: true },
    usesWhatsappForBusiness: { type: DataTypes.BOOLEAN, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: 'LandDetail',
    tableName: 'LandDetails',
    timestamps: true,
    indexes: [{ fields: ['farmerId'] }],
  }
);

export default LandDetail;
