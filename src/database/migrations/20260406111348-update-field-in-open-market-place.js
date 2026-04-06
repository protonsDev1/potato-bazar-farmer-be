"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      "openMarketPlaces",
      "expectedHarvestPeriod",
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      "openMarketPlaces",
      "expectedHarvestPeriod",
      {
        type: Sequelize.DATE,
        allowNull: true,
      },
    );
  },
};
