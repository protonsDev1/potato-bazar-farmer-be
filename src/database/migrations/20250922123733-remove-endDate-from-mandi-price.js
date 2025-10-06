"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("mandiPrices", "endDate");
    await queryInterface.renameColumn("mandiPrices", "startDate", "date")
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("mandiPrices", "endDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.renameColumn("mandiPrices", "date", "startDate")
  },
};
