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

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

seedDatabase();
