"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("news", "localizedContent", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("news", "audioUrls", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("news", "localizedContent");
    await queryInterface.removeColumn("news", "audioUrls");
  },
};