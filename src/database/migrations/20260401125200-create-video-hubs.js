"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("videoHubCategories", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      categoryName: { type: Sequelize.STRING, allowNull: false },
      categoryIcon: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW"), allowNull: false },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW"), allowNull: false },
    });

    await queryInterface.createTable("videoHubs", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "videoHubCategories", key: "id" },
        onDelete: "CASCADE",
      },
      videoThumbnail: { type: Sequelize.STRING, allowNull: false },
      videoUrl: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW"), allowNull: false },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW"), allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("videoHubs");
    await queryInterface.dropTable("videoHubCategories");
  },
};
