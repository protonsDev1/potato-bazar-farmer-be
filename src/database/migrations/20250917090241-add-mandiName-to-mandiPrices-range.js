"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("mandiPrices", "date");

    await queryInterface.addColumn("mandiPrices", "startDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("mandiPrices", "endDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("mandiPrices", "startDate");
    await queryInterface.removeColumn("mandiPrices", "endDate");

    await queryInterface.addColumn("mandiPrices", "date", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
