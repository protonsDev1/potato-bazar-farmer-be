"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "agentMonthlyTargets",
      "farmerMonthlyTarget",
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      }
    );
    await queryInterface.addColumn(
      "agentMonthlyTargets",
      "coldStorageMonthlyTarget",
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      }
    );
    await queryInterface.addColumn(
      "agentMonthlyTargets",
      "traderMonthlyTarget",
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      }
    );

    await queryInterface.removeColumn("agentMonthlyTargets", "monthlyTarget");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "agentMonthlyTargets",
      "farmerMonthlyTarget"
    );
    await queryInterface.removeColumn(
      "agentMonthlyTargets",
      "coldStorageMonthlyTarget"
    );
    await queryInterface.removeColumn(
      "agentMonthlyTargets",
      "traderMonthlyTarget"
    );

    await queryInterface.addColumn("agentMonthlyTargets", "monthlyTarget", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
  },
};
