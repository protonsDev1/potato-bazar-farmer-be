"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("wallets", "userBalance", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0.0,
    });

    await queryInterface.addColumn("wallets", "adminBalance", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0.0,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("wallets", "userBalance");
    await queryInterface.removeColumn("wallets", "adminBalance");
  },
};
