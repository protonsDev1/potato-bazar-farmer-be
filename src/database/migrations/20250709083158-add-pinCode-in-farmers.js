"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new column
    await queryInterface.addColumn("Farmers", "pinCode", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the new column
    await queryInterface.removeColumn("Farmers", "pinCode");
  },
};
