"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn("Farmers", "whatsappNumber", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Farmers", "digiPin", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn("Farmers", "whatsappNumber"),
      queryInterface.removeColumn("Farmers", "digiPin"),
    ]);
  },
};
