"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("states", "localizedContent", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("districts", "localizedContent", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("cities", "localizedContent", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("states", "localizedContent");
    await queryInterface.removeColumn("districts", "localizedContent");
    await queryInterface.removeColumn("cities", "localizedContent");
  },
};
