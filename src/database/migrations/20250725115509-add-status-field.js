"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Farmers", "status", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "pending",
    });

    await queryInterface.addColumn("coldStorages", "status", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "pending",
    });

    await queryInterface.addColumn("traders", "status", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "pending",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Farmers", "status");
    await queryInterface.removeColumn("coldStorages", "status");
    await queryInterface.removeColumn("traders", "status");
  },
};
