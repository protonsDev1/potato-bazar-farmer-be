"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new column
    await queryInterface.addColumn("LandDetails", "areaUnderDrip", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn("LandDetails", "storageCapacityAtFarm", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the new column
    await queryInterface.removeColumn("LandDetails", "areaUnderDrip");
    await queryInterface.removeColumn("LandDetails", "areaUnderDrip");
  },
};
