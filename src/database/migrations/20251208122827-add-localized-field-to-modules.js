"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("knowledgeHubs", "localizedContent", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("governmentSchemes", "localizedContent", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("events", "localizedContent", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("knowledgeHubs", "localizedContent");
    await queryInterface.removeColumn("governmentSchemes", "localizedContent");
    await queryInterface.removeColumn("events", "localizedContent");
  },
};
