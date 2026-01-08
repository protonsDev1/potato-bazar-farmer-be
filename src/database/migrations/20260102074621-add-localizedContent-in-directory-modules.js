"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("directoryCategories", "localizedContent", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn(
      "directorySubCategories",
      "localizedContent",
      {
        type: Sequelize.JSON,
        allowNull: true,
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      "directoryCategories",
      "localizedContent"
    );
    await queryInterface.removeColumn(
      "directorySubCategories",
      "localizedContent"
    );
  },
};
