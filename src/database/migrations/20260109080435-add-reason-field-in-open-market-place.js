"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("openMarketPlaces", "reason", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.removeColumn("openMarketPlaces", "isActive");

    await queryInterface.addColumn("openMarketPlaces", "isActive", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("openMarketPlaces", "reason");

    await queryInterface.removeColumn("openMarketPlaces", "isActive");

    await queryInterface.addColumn("openMarketPlaces", "isActive", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },
};
