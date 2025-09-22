"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("traders", "procurementRegionStates", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
    await queryInterface.removeColumn("traders", "mainProcurementRegion");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("traders", "procurementRegionStates");
    await queryInterface.addColumn("traders", "mainProcurementRegion", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
};
