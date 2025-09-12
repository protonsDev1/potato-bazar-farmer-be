"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("traders", "annualTurnover", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("traders", "marketCoverageStates", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("traders", "annualTurnover");
    await queryInterface.removeColumn("traders", "marketCoverageStates");
  },
};
