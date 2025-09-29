"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = [
      "adminColdStorageTypes",
      "adminConstructionTypes",
      "adminDryingFacilityDetails",
      "adminDryingMethods",
      "adminElevatorTypes",
      "adminMonitoringFacilities",
      "adminOperationalChallenges",
      "adminOtherFacilities",
      "adminPotatoDisposalSystems",
      "adminPowerFacilities",
      "adminRoofTypes",
      "adminShedTypes",
      "adminStorageBookingSystems",
      "adminStorageFeatures",
      "adminStorageTypes",
      "adminUsageTypes",
      "adminBiggestChallengesInSelling",
      "adminBrandPreferenceReasons",
      "adminFarmEquipmentsUsed",
      "adminIrrigationMethods",
      "adminIrrigationSources",
      "adminPotatoSubVarietiesGrown",
      "adminPotatoTypes",
      "adminPotatoVarietiesGrown",
      "adminPriceDiscoveries",
      "adminSeedBrands",
      "adminSellingChannels",
      "adminSellingPlaces",
      "adminSellingPrices",
      "adminSoilTypes",
      "adminSowingMethods",
      "adminTechnologiesUsed",
      "adminCropsTraded",
      "adminMarketCoverages",
      "adminTraderInterests",
      "adminTraderTypes",
      "adminTraderVarieties",
    ];

    await Promise.all(
      tables.map((table) =>
        queryInterface.addColumn(table, "isDeleted", {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        })
      )
    );
  },

  async down(queryInterface, Sequelize) {
    const tables = [
      "adminColdStorageTypes",
      "adminConstructionTypes",
      "adminDryingFacilityDetails",
      "adminDryingMethods",
      "adminElevatorTypes",
      "adminMonitoringFacilities",
      "adminOperationalChallenges",
      "adminOtherFacilities",
      "adminPotatoDisposalSystems",
      "adminPowerFacilities",
      "adminRoofTypes",
      "adminShedTypes",
      "adminStorageBookingSystems",
      "adminStorageFeatures",
      "adminStorageTypes",
      "adminUsageTypes",
      "adminBiggestChallengesInSelling",
      "adminBrandPreferenceReasons",
      "adminFarmEquipmentsUsed",
      "adminIrrigationMethods",
      "adminIrrigationSources",
      "adminPotatoSubVarietiesGrown",
      "adminPotatoTypes",
      "adminPotatoVarietiesGrown",
      "adminPriceDiscoveries",
      "adminSeedBrands",
      "adminSellingChannels",
      "adminSellingPlaces",
      "adminSellingPrices",
      "adminSoilTypes",
      "adminSowingMethods",
      "adminTechnologiesUsed",
      "adminCropsTraded",
      "adminMarketCoverages",
      "adminTraderInterests",
      "adminTraderTypes",
      "adminTraderVarieties",
    ];

    await Promise.all(
      tables.map((table) => queryInterface.removeColumn(table, "isDeleted"))
    );
  },
};
