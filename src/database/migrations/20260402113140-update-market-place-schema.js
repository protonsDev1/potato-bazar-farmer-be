"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "openMarketPlaces",
      "expectedHarvestPeriod",
      {
        type: Sequelize.DATE,
        allowNull: true,
      },
    );

    await queryInterface.addColumn(
      "openMarketPlaces",
      "approxAcreRequirement",
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );

    await queryInterface.addColumn("openMarketPlaces", "pricePreference", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "openMarketPlaces",
      "expectedHarvestPeriod",
    );
    await queryInterface.removeColumn(
      "openMarketPlaces",
      "approxAcreRequirement",
    );
    await queryInterface.removeColumn("openMarketPlaces", "pricePreference");
  },
};
