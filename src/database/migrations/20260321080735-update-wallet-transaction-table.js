"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("walletTransactions", "source", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "system",
    });

    await queryInterface.addColumn("walletTransactions", "usageType", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("walletTransactions", "referenceId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("walletTransactions", "source");
    await queryInterface.removeColumn("walletTransactions", "usageType");
    await queryInterface.removeColumn("walletTransactions", "referenceId");
  },
};
