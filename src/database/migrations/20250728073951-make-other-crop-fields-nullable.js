"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.changeColumn("otherCropsGrown", "cropName", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn("otherCropsGrown", "sowingMonth", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn("otherCropsGrown", "harvestingMonth", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.changeColumn("otherCropsGrown", "cropName", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("otherCropsGrown", "sowingMonth", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("otherCropsGrown", "harvestingMonth", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
    ]);
  },
};
