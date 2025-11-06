"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("buyRequests", "reason", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "reason", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "reason", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("buyRequests", "reason");
    await queryInterface.removeColumn("sellRequests", "reason");
    await queryInterface.removeColumn("users", "reason");
  },
};
