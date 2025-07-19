"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new column
    await queryInterface.addColumn("traders", "taluka", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("mandiDetails", "mandiLicenceNo", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the new column
    await queryInterface.removeColumn("traders", "taluka");
    await queryInterface.removeColumn("mandiDetails", "mandiLicenceNo");
  },
};
