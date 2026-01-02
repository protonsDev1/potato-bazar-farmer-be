"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "advertisementServices",
      "localizedContent",
      {
        type: Sequelize.JSON,
        allowNull: true,
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      "advertisementServices",
      "localizedContent"
    );
  },
};
