"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("coldStorageRequirements", "status", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "pending",
    });

    await queryInterface.addColumn("coldStorageRequirements", "reason", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("coldStorageRequirements", "reason");
    await queryInterface.removeColumn("coldStorageRequirements", "status");
  },
};
