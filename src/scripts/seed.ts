import AdminColdStorageType from "../database/models/adminModels/coldStorage/adminColdStorageType";
import AdminConstructionType from "../database/models/adminModels/coldStorage/adminConstructionType";
import AdminDryingFacilityDetail from "../database/models/adminModels/coldStorage/adminDryingFacilityDetails";
import AdminElevatorType from "../database/models/adminModels/coldStorage/adminElevatorType";
import AdminMonitoringFacility from "../database/models/adminModels/coldStorage/adminMonitoringFacilities";
import AdminOperationalChallenge from "../database/models/adminModels/coldStorage/adminOperationalChallenge";
import AdminOtherFacility from "../database/models/adminModels/coldStorage/adminOtherFacility";
import AdminPotatoDisposalSystem from "../database/models/adminModels/coldStorage/adminPotatoDisposableSystem";
import AdminPowerFacility from "../database/models/adminModels/coldStorage/adminPowerFacility";
import AdminRoofType from "../database/models/adminModels/coldStorage/adminRoofType";
import AdminShedType from "../database/models/adminModels/coldStorage/adminShedType";
import AdminStorageBookingSystem from "../database/models/adminModels/coldStorage/adminStorageBookingSystem";
import AdminStorageFeature from "../database/models/adminModels/coldStorage/adminStorageFeature";
import AdminStorageType from "../database/models/adminModels/coldStorage/adminStorageType";
import AdminUsageType from "../database/models/adminModels/coldStorage/adminUsageType";
import AdminBiggestChallengeInSelling from "../database/models/adminModels/farmer/adminBiggestChallengeInSelling";
import AdminBrandPreferenceReason from "../database/models/adminModels/farmer/adminBrandPreferenceReason";
import AdminFarmEquipmentUsed from "../database/models/adminModels/farmer/adminFarmEquipmentUsed";
import AdminIrrigationMethod from "../database/models/adminModels/farmer/adminIrrigationMethod";
import AdminIrrigationSource from "../database/models/adminModels/farmer/adminIrrigationSource";
import AdminPotatoType from "../database/models/adminModels/farmer/adminPotatoType";
import AdminPotatoVarietyGrown from "../database/models/adminModels/farmer/adminPotatoVarietyGrown";
import AdminPriceDiscovery from "../database/models/adminModels/farmer/adminPriceDiscovery";
import AdminSellingChannel from "../database/models/adminModels/farmer/adminSellingChannel";
import AdminSellingPrice from "../database/models/adminModels/farmer/adminSellingPrice";
import AdminSoilType from "../database/models/adminModels/farmer/adminSoilType";
import AdminTechnologyUsed from "../database/models/adminModels/farmer/adminTechnologyUsed";
import AdminCropTraded from "../database/models/adminModels/trader/adminCropTraded";
import AdminMarketCoverage from "../database/models/adminModels/trader/adminMarketCoverage";
import AdminTraderInterest from "../database/models/adminModels/trader/adminTraderInterest";
import AdminTraderType from "../database/models/adminModels/trader/adminTraderType";
import AdminTraderVariety from "../database/models/adminModels/trader/adminTraderVariety";
import { seedPotatoSubVariety } from "../services/adminServices/seedPotatoSubVariety";
import {
  coldStorageTypeList,
  constructionTypeList,
  dryingFacilityDetailsList,
  elevatorTypeLIst,
  monitoringFacilityList,
  operationalChallengeList,
  otherFacilityList,
  potatoDisposalList,
  powerFacilityList,
  roofTypeList,
  shedTypeList,
  storageBookingSystemList,
  storageFeatureList,
  storageTypeList,
  usageTypeList,
} from "../utils/constants/coldStorageSeedList";
import {
  brandReasonList,
  farmEquipmentList,
  farmingChallengeList,
  irrigationMethodList,
  irrigationSourceList,
  potatoSubVarietyList,
  potatoTypeList,
  potatoVarietyList,
  priceDiscoveryList,
  sellingChannelList,
  sellingPriceList,
  soilTypeList,
  technologyUsedList,
} from "../utils/constants/farmerSeedList";
import {
  cropTradedList,
  marketCoverageList,
  traderInterestList,
  traderTypeList,
  traderVarietyList,
} from "../utils/constants/traderSeedList";
import { seedData } from "./seedHelper";

const seedDatabase = async () => {
  try {
    await seedData(
      AdminColdStorageType,
      coldStorageTypeList,
      "Cold Storage Type"
    );

    await seedData(AdminStorageType, storageTypeList, "Storage Types");

    await seedData(AdminUsageType, usageTypeList, "Usage Types");

    await seedData(AdminStorageFeature, storageFeatureList, "Storage Features");

    await seedData(
      AdminDryingFacilityDetail,
      dryingFacilityDetailsList,
      "Drying Facility Details"
    );

    await seedData(AdminElevatorType, elevatorTypeLIst, "Elevator Types");

    await seedData(
      AdminMonitoringFacility,
      monitoringFacilityList,
      "Monitoring Facilities"
    );

    await seedData(AdminOtherFacility, otherFacilityList, "Other Facilities");

    await seedData(
      AdminConstructionType,
      constructionTypeList,
      "Construction Types"
    );

    await seedData(AdminRoofType, roofTypeList, "Roof Types");

    await seedData(AdminShedType, shedTypeList, "Shed Types");

    await seedData(
      AdminPotatoDisposalSystem,
      potatoDisposalList,
      "Potato Disposal Systems"
    );

    await seedData(AdminPowerFacility, powerFacilityList, "Power Facilities");

    await seedData(
      AdminOperationalChallenge,
      operationalChallengeList,
      "Operational Challenges"
    );

    await seedData(
      AdminStorageBookingSystem,
      storageBookingSystemList,
      "Storage Booking Systems"
    );

    await seedData(AdminCropTraded, cropTradedList, "Crops Traded");

    await seedData(AdminMarketCoverage, marketCoverageList, "Market Coverages");

    await seedData(AdminTraderInterest, traderInterestList, "Trader Interests");

    await seedData(AdminTraderType, traderTypeList, "Trader Types");

    await seedData(AdminTraderVariety, traderVarietyList, "Trader Varities");

    await seedData(
      AdminIrrigationMethod,
      irrigationMethodList,
      "Irrigation Methods"
    );

    await seedData(
      AdminIrrigationSource,
      irrigationSourceList,
      "Irrigation Sources"
    );

    await seedData(AdminSoilType, soilTypeList, "Soil Types");

    await seedData(AdminPotatoType, potatoTypeList, "Potato Types");

    await seedData(
      AdminPotatoVarietyGrown,
      potatoVarietyList,
      "Potato Varieties"
    );

    await seedPotatoSubVariety(potatoSubVarietyList);

    await seedData(
      AdminFarmEquipmentUsed,
      farmEquipmentList,
      "Farm Equipments"
    );

    await seedData(
      AdminTechnologyUsed,
      technologyUsedList,
      "Technologies Used"
    );

    await seedData(AdminSellingChannel, sellingChannelList, "Selling Channels");

    await seedData(AdminSellingPrice, sellingPriceList, "Selling Prices");

    await seedData(AdminPriceDiscovery, priceDiscoveryList, "Price Discovery");

    await seedData(
      AdminBiggestChallengeInSelling,
      farmingChallengeList,
      "Farming Biggest Challenges"
    );

    await seedData(
      AdminBrandPreferenceReason,
      brandReasonList,
      "Brand Preference Reasons"
    );

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

seedDatabase();
