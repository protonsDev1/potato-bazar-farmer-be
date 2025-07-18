"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("adminCropsTraded", "cropName", "name");
    await queryInterface.renameColumn(
      "adminTraderInterests",
      "interest",
      "name"
    );
    await queryInterface.renameColumn("adminTraderTypes", "type", "name");
    await queryInterface.renameColumn(
      "adminTraderVarieties",
      "variety",
      "name"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("adminCropsTraded", "name", "cropName");
    await queryInterface.renameColumn(
      "adminTraderInterests",
      "name",
      "interest"
    );
    await queryInterface.renameColumn("adminTraderTypes", "name", "type");
    await queryInterface.renameColumn(
      "adminTraderVarieties",
      "name",
      "variety"
    );
  },
};
