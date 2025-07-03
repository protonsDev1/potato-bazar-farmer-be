"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new column
    await queryInterface.addColumn("traders", "digiPin", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("traders", "geoLocation", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the new column
    await queryInterface.removeColumn("traders", "digiPin");
    await queryInterface.removeColumn("traders", "geoLocation");
  },
};
