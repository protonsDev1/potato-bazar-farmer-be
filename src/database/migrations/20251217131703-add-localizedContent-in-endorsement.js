"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("endorsements", "localizedContent", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("brands", "localizedContent", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn("products", "localizedContent", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("endorsements", "localizedContent");
    await queryInterface.removeColumn("brands", "localizedContent");
    await queryInterface.removeColumn("products", "localizedContent");
  },
};
