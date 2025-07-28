"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.changeColumn("traders", "geographicalMarketCovered", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.changeColumn("traders", "languagePreference", {
        type: Sequelize.STRING(50),
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.changeColumn("traders", "geographicalMarketCovered", {
        type: Sequelize.TEXT,
        allowNull: false,
      }),
      queryInterface.changeColumn("traders", "languagePreference", {
        type: Sequelize.STRING(50),
        allowNull: false,
      }),
    ]);
  },
};
