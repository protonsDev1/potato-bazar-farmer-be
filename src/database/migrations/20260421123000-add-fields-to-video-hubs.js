"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("videoHubs");

    if (!tableInfo.title) {
      await queryInterface.addColumn("videoHubs", "title", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableInfo.description) {
      await queryInterface.addColumn("videoHubs", "description", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    if (!tableInfo.language) {
      await queryInterface.addColumn("videoHubs", "language", {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Hindi",
      });
    }

    if (!tableInfo.tags) {
      await queryInterface.addColumn("videoHubs", "tags", {
        type: Sequelize.JSON,
        allowNull: true,
      });
    }

    if (!tableInfo.status) {
      await queryInterface.addColumn("videoHubs", "status", {
        type: Sequelize.ENUM("Draft", "Published"),
        defaultValue: "Published",
      });
    }

    if (!tableInfo.isFeatured) {
      await queryInterface.addColumn("videoHubs", "isFeatured", {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("videoHubs", "title");
    await queryInterface.removeColumn("videoHubs", "description");
    await queryInterface.removeColumn("videoHubs", "language");
    await queryInterface.removeColumn("videoHubs", "tags");
    await queryInterface.removeColumn("videoHubs", "status");
    await queryInterface.removeColumn("videoHubs", "isFeatured");
  },
};
