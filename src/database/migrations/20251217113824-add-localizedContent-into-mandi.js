"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("mandiPrices", "localizedContent", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("mandiLists", "localizedContent", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("mandiPrices", "localizedContent");
    await queryInterface.removeColumn("mandiLists", "localizedContent");
  },
};
